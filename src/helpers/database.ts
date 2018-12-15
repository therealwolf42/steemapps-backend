import * as mongoose from 'mongoose'; mongoose.Promise = global.Promise
import * as dotenv from 'dotenv'; dotenv.config()

import * as _g from '../_g'

export var external_db

export async function connect() {
  console.log('Connecting to DB...')
  try {
    if (mongoose.connection.readyState === 1) { // not working
      await mongoose.connection.close()
    }
    const link = process.env.NODE_ENV === 'production' ? process.env.mongo_db_prod : process.env.mongo_db_dev
    let connection = await mongoose.connect(link, { useNewUrlParser: true })
    return connection
  } catch (error) {
    console.error('connect_db', error)
    await _g.wait_sec(10)
    return
  }
}