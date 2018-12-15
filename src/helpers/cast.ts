import * as dotenv from 'dotenv'; dotenv.config()
import * as dsteem from 'dsteem'
//import * as steem from 'steem'
import _g = require('../_g')

const HISTORY_LIMIT = 500
const VOTE_FETCH_LIMIT = 5000

let main_node = 'https://steemd.privex.io'//'https://rpc.steemviz.com' , 'rpc2.steemviz.com' ''https://steemd.steemitstage.com''
export var nodes = ['https://api.steemit.com', 'https://api.steemitstage.com'] // , 'https://steemd.steemitstage.com' 'https://rpc.buildteam.io', 'https://rpc.buildteam.io',
export var current_node = nodes[0]

export var client = _g.USE_TESTNET ? dsteem.Client.testnet() : new dsteem.Client(current_node)

export let get_account = async (name) => {
  let acc = await client.database.getAccounts([name])
  return acc[0]
}

export async function get_accounts(names) {
  return await client.database.getAccounts(names)
}

export async function get_all_following(name) {
  let followers = await client.call('follow_api', 'get_following', [name, -1, 'blog', 100])
  let all_followers = followers.length > 0 ? followers : []
  while (followers.length >= 99) {
    followers = await client.call('follow_api', 'get_following', [name, followers[followers.length - 1].following, 'blog', 100])
    followers.splice(0, 1)
    if (followers.length > 0) { all_followers.push.apply(all_followers, followers) }
  }
  return all_followers.map(a => a.following)
}

export let update_global_properties = async () => {
  try {
    let properties = await client.call('condenser_api', 'get_dynamic_global_properties')
    //let fund = await client.call('condenser_api', 'get_reward_fund', ['post'])
    let global_properties = {
      total_vesting_fund: parseFloat(properties.total_vesting_fund_steem.replace(' STEEM', '')),
      total_vesting_shares: parseFloat(properties.total_vesting_shares.replace(' VESTS', '')),
    }

    if (global_properties && typeof global_properties.total_vesting_fund === 'number') _g.global_properties = global_properties
  } catch (error) {
    console.error('update_global_properties', error)
  }
}