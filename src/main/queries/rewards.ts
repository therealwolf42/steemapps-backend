import * as db_data from '../../database/data.db'

import { query, TIME_GROUP_ORDER_QUERY, TIME_GROUP_QUERY, TIMESTAMP, convert_grouped } from './query'

export let rewards_benefactor = async (app: string, account: string, asset: string, last_update) => {
  try {
    console.log(`REWARDS_BENEFACTOR_${asset}`)
    const column_name = (asset.toLowerCase() === 'vests' ? 'vesting' : asset.toLowerCase()) + '_payout'
    let q = `SELECT SUM(${column_name}), ${TIMESTAMP()} FROM VOCommentBenefactorRewards WHERE[benefactor] = '${account}' AND ${column_name} > 0 ${TIME_GROUP_ORDER_QUERY(last_update)}`
    const result = await query(q)
    const data_type = `REWARDS_BENEFACTOR_${asset}`.toLowerCase()
    const data = convert_grouped(result)
    await db_data.create_or_add_both(app, data_type, data, account)
  } catch (error) {
    console.error('rewards_benefactor', error, app)
  }
}

export let rewards_curation = async (app: string, account: string, last_update) => {
  try {
    console.log(`REWARDS_CURATION`)
    let q = `SELECT SUM(CONVERT(FLOAT, LEFT(reward, LEN(reward)-6))), ${TIMESTAMP()} FROM VOCurationRewards WHERE[curator] = '${account}' ${TIME_GROUP_ORDER_QUERY(last_update)}`
    //console.log(q)
    const result = await query(q)
    const data_type = `REWARDS_CURATION`.toLowerCase()
    const data = convert_grouped(result)
    await db_data.create_or_add_both(app, data_type, data, account)
  } catch (error) {
    console.error('rewards_benefactor', error, app)
  }
}