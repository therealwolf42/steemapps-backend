import * as mongoose from 'mongoose';// mongoose.Promise = global.Promise
import * as Model from './../models/app.model'
import * as cast from '../helpers/cast'
import * as moment from 'moment'

export interface AppData {
  name: String
}

export let find = async (name?: string) => {
  let q:any = {}
  if(name) q.name = name
  return await Model.App.find(q)
}

export let find_all = async (sort: string = 'rank', order: string = 'asc', time: string = 'last_week') => {
  return await Model.App.find({}).sort(create_sort_query(sort, order, time))
}

export let find_approved = async (approved:boolean = null, sort: string = 'rank', order:string = 'asc', time: string = 'last_week', name?:string, app_type?:string, category?:string) => {
  let q = {}
  if(name) q['name'] = name
  if(app_type) q['app_type'] = app_type
  if(category) q['category'] = category
  if(approved !== null) q['approved'] = approved
  return await Model.App.find(q).sort(create_sort_query(sort, order, time))
}

export let find_approved_lean = async (approved:boolean, sort: string = 'rank', order: string = 'asc', time: string = 'last_week') => {
  return await Model.App.find({ approved },{_id:0}).sort(create_sort_query(sort, order, time))/*.select('name')*/.lean()
}

export let create = async (name: string, display_name: string, description: string, main_account: string, accounts: { name: string, account_types: Model.AccountType[] }[],
  image: string, link: string, social: { discord?: string, twitter?: string, medium?: string, reddit?: string }, status: string, category: string, tags: string[], custom_jsons: string[], app_type: string | 'app' | 'dapp' | 'interface') => {
  try {
    return await Model.App.create({ name, display_name, description, main_account, accounts, image, link, social, status, category, tags, custom_jsons, app_type, last_update: moment.utc().toDate() })
  } catch (error) {
    console.error(error.message)
  }
}

const create_sort_query = (sort: string, order, time) => {
  let s = {}
  if(sort.includes('volume')) {
    sort = `volume.${sort.substring(sort.indexOf('_') + 1)}`
  }
  if(sort.includes('rewards')) {
    sort = `rewards.${sort.substring(sort.indexOf('_') + 1)}`
  }
  s[`${sort}.${time}`] = order
  return s
}