import * as mongoose from 'mongoose';// mongoose.Promise = global.Promise
import * as Model from './../models/data.model'
import * as cast from '../helpers/cast'
import moment = require('moment');

export let find = async (app?: string, account?: string, data_type?: string) => {
  let q: any = {}
  if (app) q.app = app
  if (account) q.account = account
  if (data_type) q.data_type = data_type
  return await Model.Data.find(q)
}



export let get_date = async (when: string | 'today' | 'last_day' | 'before_last_day' | 'before_last_week' | 'last_week' | 'before_last_month' | 'last_month', app?: string, account?: string, data_type?: string) => {
  let x = await find(app, account, data_type)
  if(!x || x.length <= 0) {
    return 0
  } else {
    x = x[0]
    let data = []
    let should_length = 1 // can be used if not all data is available or maybe too much data for a day
    if(when === 'today') {
      data = x.data.filter(y => moment.utc(y.timestamp).format('YYYY-MM-DD') === moment.utc().format('YYYY-MM-DD'))
    } else if(when === 'last_day' || when === 'before_last_day') {
      let days = when === 'last_day' ? 1 : 2
      data = x.data.filter(y => moment.utc(y.timestamp).format('YYYY-MM-DD') === moment.utc().subtract(days, 'd').format('YYYY-MM-DD'))
    } else if(when === 'last_week' || when === 'before_last_week' || when === 'last_month' || when === 'before_last_month') {
      let sub_days = 1
      let days = 7
      if(when === 'last_week') {
        sub_days = 8 // one more since we don't have data for the current, not finished day
        days = 7
      } else if (when === 'before_last_week') {
        sub_days = 15
        days = 7
      } else if(when === 'last_month') {
        sub_days = 31
        days = 30
      } else if(when === 'before_last_month') {
        sub_days = 61
        days = 30
      }
      data = x.data.filter(y => y.timestamp >= moment.utc().subtract(sub_days, 'd').toDate() && y.timestamp <= moment.utc().subtract(sub_days - days, 'd').toDate())
    }
    data = data.map(x => x.value)
    let amount = 0
    if(data.length > 0) {
      amount = data.reduce((x, y) => x + y)
    }
    return parseFloat(amount.toFixed(3))
  }
}

export let create_or_add = async (app: string, data_type: string, data: Array<any>, account?: string) => {
  let data_obj = await find(app, account, data_type)
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
    return await Model.Data.create({ app, account, data_type, data })
  }
}