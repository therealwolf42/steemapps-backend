const sql = require('mssql')
import * as _g from '../../_g'

import * as moment from 'moment'
import * as _ from 'lodash'

import * as convert from '../../helpers/convert'

let connection = null

const connection_config = {
  user: process.env.steemsql_user,
  password: process.env.steemsql_pw,
  server: process.env.steemsql_server,
  database: 'DBSteem',
  connectionTimeout: 10000, // 5 Minutes
  requestTimeout: 1000 * 60 * 60 // 5 Minutes
}

let last_update = moment.utc().subtract(30, 'd').toISOString()

export const TIMESTAMP = (var_name = 'timestamp') => { return `YEAR(${var_name}), MONTH(${var_name}), DAY(${var_name})` }

export const TIME_GROUP_QUERY = (last, var_name = 'timestamp', group_var = '') => { return `AND ${var_name} > '${last}' GROUP BY ${group_var ? `[${group_var}], ` : ''}${TIMESTAMP(var_name)} ORDER BY ${TIMESTAMP(var_name)} ASC;` }

export let query = async (q: string) => {
  try {
    if (!connection) connection = await sql.connect(connection_config)
    let result = await sql.query(q) 
    return result ? result.recordsets[0] : []
  } catch (e) {
    console.log(e)
    // ... error checks
  }
}

export let convert_grouped = (result) => {
  let data = result
  data = data.map(x => {
    const y = Object.values(x)[0]
    let value = parseFloat(y[0].toFixed(3))
    return {
      value, timestamp: moment.utc(`${y[1]}-${y[2] < 10 ? '0' + y[2] : y[2]}-${y[3] < 10 ? '0' + y[3] : y[3]}`).toDate()
    }
  })
  data = data.filter(x => moment.utc(x.timestamp).format('YYYY-MM-D') !== moment.utc().format('YYYY-MM-D'))
  return data
}

export let convert_grouped_with_users = (result) => {
  let data = result
  data = data.map(x => {
    const from = Object.values(x)[0]
    const time = Object.values(x)[1]
    return {
      from, timestamp: moment.utc(`${time[0]}-${time[1] < 10 ? '0' + time[1] : time[1]}-${time[2] < 10 ? '0' + time[2] : time[2]}`).toDate()
    }
  })
  data = data.filter(x => moment.utc(x.timestamp).format('YYYY-MM-D') !== moment.utc().format('YYYY-MM-D'))

  data = _(data).groupBy(x => moment.utc(x.timestamp).toISOString()).value()

  let new_data = []
  for(let timestamp in data) {
    let timeframe = data[timestamp]
    new_data.push({ value: timeframe.length, timestamp, users: timeframe.map(x => x.from) })
  }
  
  return new_data
}