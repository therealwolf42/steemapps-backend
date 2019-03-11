
import { dau_meta, dau_transfers, dau_custom, dau_benefactor, dau_general } from '../queries/dau'
import { tx_custom, tx_meta, tx_transfers } from '../queries/tx'
import { volume_transfers } from '../queries/volume'
import { rewards_benefactor, rewards_curation } from '../queries/rewards'
import { vests_to_sp, get_change, add_values, add_values_total_users } from '../../helpers/convert'
import { update_global_properties } from '../../helpers/cast'
import { update_steempower } from './steem'
import * as db_app from '../../database/app.db'
import * as db_data from '../../database/data.db'

import * as _g from '../../_g'
import * as _ from 'lodash'
import moment = require('moment')

export let update_data = async () => {

  // Update CUSTOM JSON DAU for 'vote', 'transfer' & 'delegate'
  const d = moment.utc().subtract(62, 'd').toISOString()

  let x = await Promise.all([
    dau_general('vote', d),
    dau_general('transfer', d),
    dau_general('delegate', d),
    dau_general('active_user', d)
  ])
  
  // dau_general('follow', d) # for the future

  let apps = await db_app.find_approved(true)
  for (let app of apps) {
    try {
      if (moment.utc().dayOfYear() <= moment.utc(app.last_update_data).dayOfYear() && moment.utc().year() <= moment.utc(app.last_update_data).year()) {
        continue
      }

      let missing_days = moment.utc().dayOfYear() - moment.utc(app.last_update_data).dayOfYear()
      if(missing_days > 62) missing_days = 62
      if(missing_days <= 0) missing_days = 0
      let last_update_data = moment.utc().subtract(missing_days + 2, 'd').toISOString()
      console.log('Updating data', app.name, last_update_data)
      for (let acc of app.accounts) {

        try {
          // Incoming Transfers
          if (acc.transfer || acc.transfer_only_dau) {
            if (!acc.transfer_only_dau) {
              for (let asset of ['SBD', 'STEEM']) {
                await volume_transfers(app.name, acc.name, asset, last_update_data)
                await tx_transfers(app.name, acc.name, asset, last_update_data)
              }
            }
            await dau_transfers(app.name, acc.name, last_update_data)
          }

          // Meta Object on Comments (Used by interfaces)
          if (acc.meta) {
            await tx_meta(app.name, acc.name, last_update_data)
            await dau_meta(app.name, acc.name, last_update_data)
          }

          // Benefactor Reward by Interfaces
          if (acc.benefactor) {
            await dau_benefactor(app.name, acc.name, last_update_data)
            for (let asset of ['SBD', 'STEEM', 'VESTS']) {
              await rewards_benefactor(app.name, acc.name, asset, last_update_data)
            }
          }

          // Curation Rewards
          if (acc.curation) {
            await rewards_curation(app.name, acc.name, last_update_data)
          }

        } catch (error) {
          console.error('process_accounts', 'update_data', error, acc.name)
        }

      }
      // Custom JSON
      for (let custom of app.custom_jsons) {
        await tx_custom(app.name, custom, last_update_data)
        await dau_custom(app.name, custom, last_update_data)
      }

      // Creates the unique number of users for app
      await db_data.create_total_dau(app.name)

      app.last_update_data = moment.utc().toISOString()
      await app.save()
    } catch (error) {
      console.error('process_app', 'update_data', error, app.name)
    }
  }
  console.log('Finished Update')
}

export let set_data = async () => {
  await update_global_properties()
  let apps = await db_app.find_approved(true)
  for (let app of apps) {
    try {
      console.log('Setting data', app.name)
      let volume_sbd_container = []
      let volume_steem_container = []
      let dau_container = []
      let tx_container = []
      let rewards_sbd_container = []
      let rewards_steem_container = []
      let i = 0
      for (let acc of app.accounts) {
        try {
          tx_container[i] = await update_tx(app.name, acc.name, app.custom_jsons)
          let volume = await update_volume(app.name, acc.name)
          let rewards = await update_rewards(app.name, acc.name)
          volume_sbd_container[i] = volume.sbd
          volume_steem_container[i] = volume.steem
          rewards_sbd_container[i] = rewards.sbd
          rewards_steem_container[i] = rewards.steem
        } catch (error) {
          console.error('set_data', app.name, error)
        }
        i += 1
      }

      app.dau = await update_dau(app.name, '') // Updates with total_dau
      app.tx = add_values(tx_container)

      app.volume = { sbd: add_values(volume_sbd_container), steem: add_values(volume_steem_container) }
      app.rewards = { sbd: add_values(rewards_sbd_container), steem: add_values(rewards_steem_container) }
      //app.last_update = moment.utc().toDate()
      await app.save()

      // Sets the Steempower values for App
      await update_steempower(app)
    } catch (error) {
      console.error('set_app', 'set_data', error, app.name)
    }
  }
  console.log('Finished Data')
}



let get_date = async (app_name?: string, acc_name?: string, data_type?: string) => {
  try {
    let x = {}
    for (let d of ['last_day', 'last_week', 'last_month']) {

      // TEMPORARY UNTIL CUSTOM DAU IS FULLY UPDATED
      if (data_type === _g.data_type.dau_custom && (d === 'last_week' || d === 'last_month')) {
        x[d] = await db_data.get_sum_from_data('last_day', app_name, acc_name, data_type) * (d === 'last_week' ? 7 : 30) // d
        x[`before_${d}`] = await db_data.get_sum_from_data(`${'last_day'}`, app_name, acc_name, data_type) * (d === 'last_week' ? 7 : 30) // before_d
      } else {
        x[d] = await db_data.get_sum_from_data(d, app_name, acc_name, data_type)
        x[`before_${d}`] = await db_data.get_sum_from_data(`before_${d}`, app_name, acc_name, data_type)
      }

      if (data_type === _g.data_type.rewards_benefactor_vests || data_type === _g.data_type.rewards_curation) {
        x[d] = vests_to_sp(x[d], _g.global_properties)
        x[`before_${d}`] = vests_to_sp(x[`before_${d}`], _g.global_properties)
      }
    }
    return x
  } catch (error) {
    console.error('get_date', error, app_name)
  }
}

let get_date_dau = async (app_name?: string, acc_name?: string, data_type?: string) => {
  try {
    let x = {}
    for (let d of ['last_day', 'last_week', 'last_month']) {
      x[d] = await db_data.get_sum_from_data_dau(d, app_name, acc_name, data_type)
      x[`before_${d}`] = await db_data.get_sum_from_data_dau(`before_${d}`, app_name, acc_name, data_type)
      if(!x[d] || x[d] <= 0) x[d] =  x[`before_${d}`]
    }
    return x
  } catch (error) {
    console.error('get_date', error, app_name)
  }
}


let update_dau = async (app_name, acc_name) => {
  try {
    const dau = []
    dau[0] = await get_date_dau(app_name, acc_name, _g.data_type.dau_total)
    return add_values(dau)
  } catch (error) {
    console.error('update_dau', error, app_name)
  }
}

let update_volume = async (app_name, acc_name) => {
  try {
    const volume_sbd = []
    const volume_steem = []

    volume_sbd[0] = await get_date(app_name, acc_name, _g.data_type.volume_transfers_sbd)
    volume_steem[0] = await get_date(app_name, acc_name, _g.data_type.volume_transfers_steem)
    return { sbd: add_values(volume_sbd), steem: add_values(volume_steem) }
  } catch (error) {
    console.error('update_volume', error, app_name)
  }
}

let update_tx = async (app_name, acc_name, custom_jsons) => {
  try {
    const tx = []
    tx[0] = await get_date(app_name, acc_name, _g.data_type.tx_transfers_sbd)
    tx[1] = await get_date(app_name, acc_name, _g.data_type.tx_transfers_steem)
    tx[2] = await get_date(app_name, acc_name, _g.data_type.tx_meta)
    let i = 2
    for (let custom of custom_jsons) {
      i += 1
      tx[i] = await get_date(app_name, custom, _g.data_type.tx_custom)
    }

    // Experimental for next Update
    /*db_data.get_last_month_array(app_name, [
      {
        keys: [acc_name],
        values: [_g.data_type.tx_transfers_sbd, _g.data_type.tx_transfers_steem, _g.data_type.tx_meta]
      },
      {
        keys: custom_jsons,
        values: [_g.data_type.tx_custom]
      }
    ])*/

    return add_values(tx)
  } catch (error) {
    console.error('update_tx', error, app_name)
  }
}

let update_rewards = async (app_name, acc_name) => {
  try {
    const rewards_sbd = []
    const rewards_steem = []
    const rewards_all = []

    rewards_sbd[0] = await get_date(app_name, acc_name, _g.data_type.rewards_benefactor_sbd)

    rewards_steem[0] = await get_date(app_name, acc_name, _g.data_type.rewards_benefactor_steem)
    rewards_steem[1] = await get_date(app_name, acc_name, _g.data_type.rewards_benefactor_vests)
    rewards_steem[2] = await get_date(app_name, acc_name, _g.data_type.rewards_curation)

    const sbd = add_values(rewards_sbd)
    const steem = add_values(rewards_steem)
    return { sbd, steem }
  } catch (error) {
    console.error('update_rewards', error, app_name)
  }
}