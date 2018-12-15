import * as db_data from '../../database/data.db'

import { query, TIME_GROUP_QUERY, TIMESTAMP, convert_grouped } from './query'

/**
 * TX of transfers to account
 */
export let tx_transfers = async (app: string, account: string, asset: string, last_update) => {
  try {
    console.log(`TX_TRANSFERS_${asset}`)
    let q = `SELECT COUNT(*), ${TIMESTAMP()} FROM TxTransfers WHERE[to] = '${account}' AND amount_symbol = '${asset}' ${TIME_GROUP_QUERY(last_update)}`
    const result = await query(q)
    const data_type = `TX_TRANSFERS_${asset}`.toLowerCase()
    const data = convert_grouped(result)
    await db_data.create_or_add(app, data_type, data, account)
  } catch (error) {
    console.error('tx_transfers', error, app)
  }
}

/**
 * TX of custom_jsons
 */
export let tx_custom = async (app: string, custom_string: string, last_update) => {
  try {
    console.log(`TX_CUSTOM`)
    let q = `SELECT COUNT(*), ${TIMESTAMP()} FROM TxCustoms WHERE left(tid, ${custom_string.length}) = '${custom_string}' ${TIME_GROUP_QUERY(last_update)}`
    const result = await query(q)
    const data_type = `TX_CUSTOM`.toLowerCase()
    const data = convert_grouped(result)
    await db_data.create_or_add(app, data_type, data, custom_string)
  } catch (error) {
    console.error('volume_custom', error, app, custom_string)
  }
}

export let tx_meta = async (app: string, meta_name: string, last_update) => {
  try {
    console.log(`TX_META`)
    let q = `SELECT COUNT(*), ${TIMESTAMP('created')} FROM Comments WHERE ISJSON(json_metadata) > 0 AND SUBSTRING(JSON_VALUE(json_metadata, '$.app'), 0, ${meta_name.length + 1}) = '${meta_name}' ${TIME_GROUP_QUERY(last_update, 'created')}`
    const result = await query(q)
    const data_type = `TX_META`.toLowerCase()
    const data = convert_grouped(result)
    await db_data.create_or_add(app, data_type, data, meta_name)
  } catch (error) {
    console.error('tx_transfers', error, app)
  }
}