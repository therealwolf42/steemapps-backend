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

export const TIME_GROUP_QUERY = (last, var_name = 'timestamp') => { return `AND ${var_name} > '${last}' GROUP BY ${TIMESTAMP(var_name)} ORDER BY ${TIMESTAMP(var_name)} ASC;` }

export let query = async (q: string) => {
  try {
    if (!connection) connection = await sql.connect(connection_config)
    return await sql.query(q)
  } catch (e) {
    console.log(e)
    // ... error checks
  }
}

export let convert_grouped = (result) => {
  let data = result.recordsets[0]
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
