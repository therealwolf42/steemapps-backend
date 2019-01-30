import * as dotenv from 'dotenv'; dotenv.config({ path: '.env' })

import * as db_data from '../../database/data.db'

import { create_arr_of_arrays } from '../../helpers/convert'

import { query, TIME_GROUP_ORDER_QUERY, TIME_GROUP_QUERY, ORDER_QUERY, TIMESTAMP, convert_grouped, convert_grouped_with_users, convert_general_grouped_with_users } from './query'

/**
 * Daily Average Users for Transfers both in STEEM & SBD
 */
export let dau_transfers = async (app: string, account: string, last_update) => {
  try {
    console.log(`DAU_TRANSFERS`)
    let THRESHOLD = process.env.TRANSFER_THRESHOLD
    //let q = `SELECT COUNT(DISTINCT([from])), ${TIMESTAMP()} FROM TxTransfers WHERE[to] = '${account}' ${TIME_GROUP_ORDER_QUERY(last_update)}`
    let query_incoming = `SELECT DISTINCT([from]), ${TIMESTAMP()} FROM TxTransfers WHERE[to] = '${account}' AND amount >= ${THRESHOLD} ${TIME_GROUP_ORDER_QUERY(last_update, 'timestamp', 'from')}`
    let query_outgoing = `SELECT DISTINCT([to]), ${TIMESTAMP()} FROM TxTransfers WHERE[from] = '${account}' AND amount >= ${THRESHOLD} ${TIME_GROUP_ORDER_QUERY(last_update, 'timestamp', 'to')}`

    const result_incoming = await query(query_incoming)
    const result_outgoing = await query(query_outgoing)
    
    const data_type = `dau_transfers`
    const data_incoming = convert_grouped_with_users(result_incoming)
    const data_outgoing = convert_grouped_with_users(result_outgoing)
    
    let data = data_incoming // db_data.create_grouped_data_users(create_arr_of_arrays([data_incoming, data_outgoing]))

    await db_data.create_or_add_both(app, data_type, data, account)
    await db_data.create_or_add_both(app, `${data_type}_outgoing`, db_data.create_grouped_data_users(data_outgoing), account) 
    await db_data.create_or_add_both(app, `${data_type}_incoming`, db_data.create_grouped_data_users(data_incoming), account) 
  } catch (error) {
    console.error('dau_transfers', error, app, account)
  }
}



export let dau_meta = async (app: string, meta_name: string, last_update) => {
  try {
    console.log(`DAU_META`)
    let q = `SELECT DISTINCT[author], ${TIMESTAMP('created')} FROM Comments WHERE ISJSON(json_metadata) > 0 AND SUBSTRING(JSON_VALUE(json_metadata, '$.app'), 0, ${meta_name.length + 1}) = '${meta_name}' ${TIME_GROUP_ORDER_QUERY(last_update, 'created', 'author')};`
    const result = await query(q)
    const data_type = `DAU_META`.toLowerCase()
    const data = convert_grouped_with_users(result)
    await db_data.create_or_add_both(app, data_type, data, meta_name)
  } catch (error) {
    console.error('dau_meta', error, app)
  }
}

export let dau_custom = async (app: string, custom_string: string, last_update) => {
  try {
    console.log(`DAU_CUSTOM`)
    let q = `SELECT DISTINCT[required_posting_auths], ${TIMESTAMP()} FROM TxCustoms WHERE left(tid, ${custom_string.length}) = '${custom_string}' ${TIME_GROUP_ORDER_QUERY(last_update, 'timestamp', 'required_posting_auths')}`
    const result = await query(q)
    const data_type = `DAU_CUSTOM`.toLowerCase()
    const data = convert_grouped_with_users(result)
    await db_data.create_or_add_both(app, data_type, data, custom_string)
  } catch (error) {
    console.error('dau_custom', error, app)
  }
}

export let dau_benefactor = async (app: string, account: string, last_update) => {
  try {
    console.log(`DAU_BENEFACTOR`)
    let q = `SELECT DISTINCT[author], ${TIMESTAMP()} FROM VOCommentBenefactorRewards WHERE[benefactor] = '${account}' ${TIME_GROUP_ORDER_QUERY(last_update, 'timestamp', 'author')}`
    const result = await query(q)
    const data_type = `DAU_BENEFACTOR`.toLowerCase()
    const data = convert_grouped_with_users(result)
    await db_data.create_or_add_both(app, data_type, data, account)
  } catch (error) {
    console.error('dau_custom', error, app)
  }
}

export let dau_vote_general = async (last_update) => {
  console.log(`DAU_VOTE_GENERAL`)
  let q = `SELECT DISTINCT[required_posting_auths], json_metadata, ${TIMESTAMP()} FROM TxCustoms WHERE left(tid, ${'vote'.length}) = 'vote' ${TIME_GROUP_QUERY(last_update, 'timestamp', 'required_posting_auths')}, json_metadata ${ORDER_QUERY('timestamp')}`
  const result = await query(q)
  const data_type = `DAU_VOTE_GENERAL`.toLowerCase()
  const data = convert_general_grouped_with_users(result)
  for(let app in data) {
    await db_data.create_or_add_both(app, data_type, data[app])
  }
  
  console.log(data)
}