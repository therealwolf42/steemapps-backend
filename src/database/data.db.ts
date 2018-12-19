import * as mongoose from 'mongoose';// mongoose.Promise = global.Promise
import * as Model from './../models/data.model'
import * as cast from '../helpers/cast'
import { remove_duplicates, create_arr_of_arrays } from '../helpers/convert'
import moment = require('moment')

import * as _g from '../_g'
import * as _ from 'lodash'

export let find_extern = async (app?: string, account?: string, data_type?: string) => {
  let q: any = {}
  if (app) q.app = app
  if (account) q.account = account
  if (data_type) q.data_type = data_type
  return await Model.DataLean.find(q)
}

export let find_intern = async (app?: string, account?: string, data_type?: string) => {
  let q: any = {}
  if (app) q.app = app
  if (account) q.account = account
  if (data_type) q.data_type = data_type
  return await Model.DataDetailed.find(q)
}

export let get_data_by_date = async (when: string | 'today' | 'last_day' | 'before_last_day' | 'before_last_week' | 'last_week' | 'before_last_month' | 'last_month', app?: string, account?: string, data_type?: string) => {
  let x = await find_intern(app, account, data_type)
  if (!x || x.length <= 0) {
    return []
  } else {
    x = x[0]
    let data = []
    let should_length = 1 // can be used if not all data is available or maybe too much data for a day
    if (when === 'today') {
      data = x.data.filter(y => moment.utc(y.timestamp).format('YYYY-MM-DD') === moment.utc().format('YYYY-MM-DD'))
    } else if (when === 'last_day' || when === 'before_last_day') {
      let days = when === 'last_day' ? 1 : 2
      data = x.data.filter(y => moment.utc(y.timestamp).format('YYYY-MM-DD') === moment.utc().subtract(days, 'd').format('YYYY-MM-DD'))
    } else if (when === 'last_week' || when === 'before_last_week' || when === 'last_month' || when === 'before_last_month') {
      let sub_days = 1
      let days = 7
      if (when === 'last_week') {
        sub_days = 8 // one more since we don't have data for the current, not finished day
        days = 7
      } else if (when === 'before_last_week') {
        sub_days = 15
        days = 7
      } else if (when === 'last_month') {
        sub_days = 31
        days = 30
      } else if (when === 'before_last_month') {
        sub_days = 61
        days = 30
      }
      data = x.data.filter(y => y.timestamp >= moment.utc().subtract(sub_days, 'd').toDate() && y.timestamp <= moment.utc().subtract(sub_days - days, 'd').toDate())
    }
    return data
  }
}

export const get_sum_from_data = async (when: string | 'today' | 'last_day' | 'before_last_day' | 'before_last_week' | 'last_week' | 'before_last_month' | 'last_month', app?: string, account?: string, data_type?: string) => {
  let data = await get_data_by_date(when, app, account, data_type)

  data = data.map(x => x.value)
  let amount = 0
  if (data.length > 0) {
    amount = data.reduce((x, y) => x + y)
  }

  return parseFloat(amount.toFixed(3))
}

export const get_sum_from_data_dau = async (when: string | 'today' | 'last_day' | 'before_last_day' | 'before_last_week' | 'last_week' | 'before_last_month' | 'last_month', app?: string, account?: string, data_type?: string) => {
  let data = await get_data_by_date(when, app, account, data_type)
  let users = Array.from(new Set(create_arr_of_arrays(data.map(x => x.users))))
  return users.length
}

export let create_or_add_both = async (app: string, data_type: string, data: Array<any>, account?: string) => {
  await create_or_add(true, app, data_type, data, account)
  await create_or_add(false, app, data_type, data, account)
}

export let create_or_add = async (external: boolean, app: string, data_type: string, data: Array<any>, account?: string) => {
  let data_obj = external ? await find_extern(app, account, data_type) : await find_intern(app, account, data_type)
  if (data_obj.length > 0) {
    // Check that data is not yet existing
    data = data.filter(x => data_obj[0].data.filter(y => {
      return moment.utc(y.timestamp).isSame(x.timestamp) //moment.utc(y.timestamp).format('YYYY-MM-DD') === moment.utc(x.timestamp).format('YYYY-MM-DD')
    }).length <= 0)
    data_obj[0].data = data_obj[0].data.concat(data)
    data_obj[0].markModified('data')
    await data_obj[0].save()
    return data_obj[0]
  } else {
    return external ? await Model.DataLean.create({ app, account, data_type, data }) : await Model.DataDetailed.create({ app, account, data_type, data })
  }
}

export let create_total_dau = async (app: string) => {
  let data = []
  // Get all data from accounts and group based on date
  for(let data_type of [_g.data_type.dau_custom, _g.data_type.dau_meta, _g.data_type.dau_transfers, _g.data_type.dau_benefactor]) {
    let data_db = await find_intern(app, '', data_type)
    for (let d of data_db) {
      data = data.concat(d.data)
    }
  }

  // Group data
  let data_for_db = create_grouped_data_users(data)

  // Create/Add as dau_total in DB
  await create_or_add_both(app, _g.data_type.dau_total, data_for_db)
}

export let create_grouped_data_users = (data) => {
  let grouped_data = _(data).groupBy(x => moment.utc(x.timestamp).toISOString()).value()
  let data_for_db = []
  for(let timestamp in grouped_data) {
    let users = []
    for (let g of grouped_data[timestamp]) {
      users = users.concat(g.users)
    }
    
    // Remove duplicates created by other data_types
    users = Array.from(new Set(users))

    data_for_db.push({
      users, value: users.length, timestamp
    })
  }
  return data_for_db
}