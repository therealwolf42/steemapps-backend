export const USE_TESTNET = false

export let global_properties = {}

export const category = {
  games: 'Games',
  entertainment: 'Entertainment',
  exchanges: 'Exchanges',
  gambling: 'Gambling',
  wallet: 'Wallet',
  finance: 'Finance',
  promotion: 'Promotion',
  social: 'Social',
  media: 'Media',
  security: 'Security',
  utility: 'Utility',
  interface: 'Interface',
  education: 'Education',
  health: 'Health',
  content_discovery: 'Content Discovery'
}

export const data_type = {
  volume_transfers_sbd: 'volume_transfers_sbd',
  volume_transfers_steem: 'volume_transfers_steem',
  volume_meta: 'volume_meta',
  tx_transfers_sbd: 'tx_transfers_sbd',
  tx_transfers_steem: 'tx_transfers_steem',
  tx_custom: 'tx_custom',
  dau_transfers_outgoing: 'dau_transfers_outgoing',
  dau_transfers_incoming: 'dau_transfers_incoming',
  dau_benefactor: 'dau_benefactor',
  dau_transfers: 'dau_transfers',
  dau_meta: 'dau_meta',
  dau_custom: 'dau_custom',
  dau_total: 'dau_total',
  tx_meta: 'tx_meta',
  rewards_benefactor_sbd: 'rewards_benefactor_sbd',
  rewards_benefactor_steem: 'rewards_benefactor_steem',
  rewards_benefactor_vests: 'rewards_benefactor_vests',
  rewards_curation: 'rewards_curation'
}

export const app_type = {
  app: 'app',
  dapp: 'dapp',
  interface: 'interface'
}

export let processing_accounts = []
export let adding_votes = false

export let wait_sec = async (sec) => {
  return await Promise.all([
      timeout(sec * 1000)
  ])
}

export let wait_hour = async (hour) => {
  return await Promise.all([
      timeout(hour * 60 * 60 * 1000)
  ])
}

let timeout = (ms: any) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


