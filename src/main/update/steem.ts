import * as _g from '../../_g'

import * as convert from '../../helpers/convert'
import * as cast from '../../helpers/cast'

// TO-DO optimize
export let update_steempower = async (app) => {
  try {
    const array_list = convert.objects_to_arr(app.accounts, 'name')
    const steempower = { effective: 0, own: 0 }
    for (let list of array_list) {
      const accounts = await cast.get_accounts(list)
      for (let account of accounts) {
        const { effective_steempower, own_steempower } = await get_steempower(account)
        if (effective_steempower > 0 && !isNaN(effective_steempower)) steempower.effective += effective_steempower
        if (own_steempower > 0 && !isNaN(own_steempower)) steempower.own += own_steempower
      }
    }
    app.steempower = steempower
    app.markModified('steempower')
    await app.save()
  } catch (error) {
    console.error('process_app', 'update_steempower', error, app.name)
  }
}

const get_steempower = async (account) => {
  let vesting_shares = parseFloat(account.vesting_shares.toString().replace(' VESTS', ''))
  let received_vesting_shares = parseFloat(account.received_vesting_shares.toString().replace(' VESTS', ''))
  let delegated_vesting_shares = parseFloat(account.delegated_vesting_shares.toString().replace(' VESTS', ''))
  let effective_steempower = convert.vests_to_sp((vesting_shares - delegated_vesting_shares) + received_vesting_shares, _g.global_properties)
  let own_steempower = convert.vests_to_sp(vesting_shares, _g.global_properties)
  return { effective_steempower, own_steempower }
}