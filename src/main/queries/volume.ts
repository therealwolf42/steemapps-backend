import * as db_data from '../../database/data.db'

import { query, TIME_GROUP_QUERY, TIMESTAMP, convert_grouped } from './query'

/**
 * Sum of all transfers to account
 */
export let volume_transfers = async (app: string, account: string, asset: string, last_update) => {
  try {
    console.log(`VOLUME_TRANSFERS_${asset}`)
    let q = `SELECT SUM(amount), ${TIMESTAMP()} FROM TxTransfers WHERE[to] = '${account}' AND amount_symbol = '${asset}' ${TIME_GROUP_QUERY(last_update)}`
    const result = await query(q)
    const data_type = `VOLUME_TRANSFERS_${asset}`.toLowerCase()
    const data = convert_grouped(result)
    await db_data.create_or_add(app, data_type, data, account)
  } catch (error) {
    console.error('volume_transfers', error)
  }

}

export let volume_payouts = async (app: string, account: string, asset: string, last_update) => {
  console.log(`VOLUME_PAYOUTS_${asset}`)
  let q = `SELECT SUM(amount), ${TIMESTAMP()} FROM TxTransfers WHERE[to] = '${account}' AND amount_symbol = '${asset}' ${TIME_GROUP_QUERY(last_update)}`
}