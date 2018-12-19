import * as db_data from '../../database/data.db'

import { create_arr_of_arrays, create_grouped_array, create_sum_array_of_group } from '../../helpers/convert'

import { query, TIME_GROUP_QUERY, TIMESTAMP, convert_grouped } from './query'

/**
 * TX of transfers to account
 */
export let tx_transfers = async (app: string, account: string, asset: string, last_update) => {
  try {
    let THRESHOLD = process.env.TRANSFER_THRESHOLD
    console.log(`TX_TRANSFERS_${asset}`)
    let query_incoming = `SELECT COUNT(*), ${TIMESTAMP()} FROM TxTransfers WHERE[to] = '${account}' AND amount_symbol = '${asset}' AND amount >= ${THRESHOLD} ${TIME_GROUP_QUERY(last_update)}`
    let query_outgoing = `SELECT COUNT(*), ${TIMESTAMP()} FROM TxTransfers WHERE[from] = '${account}' AND amount_symbol = '${asset}' AND amount >= ${THRESHOLD} ${TIME_GROUP_QUERY(last_update)}`

    const result_incoming = await query(query_incoming)
    const result_outgoing = await query(query_outgoing)

    const data_type = `TX_TRANSFERS_${asset}`.toLowerCase()
    const data_incoming = convert_grouped(result_incoming)
    const data_outgoing = convert_grouped(result_outgoing)

    const data = create_sum_array_of_group(create_grouped_array(create_arr_of_arrays([data_incoming, data_outgoing])))

    await db_data.create_or_add_both(app, data_type, data, account)
    await db_data.create_or_add_both(app, `${data_type}_outgoing`, data_outgoing, account) 
    await db_data.create_or_add_both(app, `${data_type}_incoming`, data_incoming, account) 
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
    await db_data.create_or_add_both(app, data_type, data, custom_string)
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
    await db_data.create_or_add_both(app, data_type, data, meta_name)
  } catch (error) {
    console.error('tx_transfers', error, app)
  }
}