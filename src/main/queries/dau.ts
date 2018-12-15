import * as db_data from '../../database/data.db'

import { query, TIME_GROUP_QUERY, TIMESTAMP, convert_grouped } from './query'

/**
 * Daily Average Users for Transfers both in STEEM & SBD
 */
export let dau_transfers = async (app: string, account: string, last_update) => {
  try {
    console.log(`DAU_TRANSFER`)
    let q = `SELECT COUNT(DISTINCT([from])), ${TIMESTAMP()} FROM TxTransfers WHERE[to] = '${account}' ${TIME_GROUP_QUERY(last_update)}`
    const result = await query(q)
    const data_type = `dau_transfer`
    const data = convert_grouped(result)
    await db_data.create_or_add(app, data_type, data, account)
  } catch (error) {
    console.error('dau_transfers', error, app, account)
  }
}

export let dau_meta = async (app: string, meta_name: string, last_update) => {
  try {
    console.log(`DAU_META`)
    let q = `SELECT COUNT(DISTINCT[author]), ${TIMESTAMP('created')} FROM Comments WHERE ISJSON(json_metadata) > 0 AND SUBSTRING(JSON_VALUE(json_metadata, '$.app'), 0, ${meta_name.length + 1}) = '${meta_name}' ${TIME_GROUP_QUERY(last_update, 'created')};`
    const result = await query(q)
    const data_type = `DAU_META`.toLowerCase()
    const data = convert_grouped(result)
    await db_data.create_or_add(app, data_type, data, meta_name)
  } catch (error) {
    console.error('dau_meta', error, app)
  }
}

// Add dau_custom once possible

export let dau_custom = async (app: string, custom_string: string, last_update) => {
  try {
    console.log(`DAU_CUSTOM`)
    let q = `SELECT COUNT(DISTINCT[required_posting_auths]), ${TIMESTAMP()} FROM TxCustoms WHERE left(tid, ${custom_string.length}) = '${custom_string}' ${TIME_GROUP_QUERY(last_update)}`
    const result = await query(q)
    const data_type = `DAU_CUSTOM`.toLowerCase()
    const data = convert_grouped(result)
    await db_data.create_or_add(app, data_type, data, custom_string)
  } catch (error) {
    console.error('dau_custom', error, app)
  }
}
