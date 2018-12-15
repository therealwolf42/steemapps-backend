import * as db from './helpers/database'
import * as mongoose from 'mongoose'

import { update_data, set_data } from './main/update/apps'
import { update_rank } from './main/update/rank'

import { update_global_properties } from './helpers/cast'
import { create_initial_apps } from './main/update/initial'

import * as _g from './_g'

var connected = false
var connection: any = {}

export var stop_bool = false

export let start = async () => {
  try {
    while (!connected) {
      await try_connection()
    }

    // Create the initial Apps
    console.log('create_initial_apps')
    await create_initial_apps()

    main()

  } catch (e) {
    console.error('Main Error', e)
    if (e.message.includes('504')) {
      connection.close()
      start()
    } else {
      start()
    }
  }
}


let main = async () => {
  while (true) {
    try {
      // Update Global Properties for calculation of Vests to Steempower
      console.log('update_global_properties')
      await update_global_properties()

      // Update the data from approved Apps
      console.log('update_data')
      await update_data()

      // Set the data from approved Apps
      console.log('set_data')
      await set_data()

      // Sets the rank for approved Apps
      console.log('update_rank')
      await update_rank()

      console.log('Finished round - waiting 0.2 hours')
      await _g.wait_hour(0.2)
    } catch (error) {
      console.error('main', error)
      await _g.wait_sec(10)
      main()
    }
  }
}

let try_connection = async () => {
  if (mongoose.connection.readyState === 1) {
    connected = true
    //log.notif('Successfully connected to DB')
  } else {
    connected = false;
    connection = await db.connect()
  }
}