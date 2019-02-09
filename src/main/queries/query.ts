
import * as _g from '../../_g'

import * as moment from 'moment'
import * as _ from 'lodash'

import * as convert from '../../helpers/convert'
import { isArray } from 'util';


let last_update = moment.utc().subtract(30, 'd').toISOString()

export const TIMESTAMP = (var_name = 'timestamp') => { return `YEAR(${var_name}), MONTH(${var_name}), DAY(${var_name})` }

export const TIME_GROUP_ORDER_QUERY = (last, var_name = 'timestamp', group_var = '') => {
  return `${TIME_GROUP_QUERY(last, var_name, group_var)} ${ORDER_QUERY(var_name)}`
}

export const TIME_GROUP_QUERY = (last, var_name = 'timestamp', group_var = '') => {
  return `AND ${var_name} > '${last}' GROUP BY ${group_var ? `[${group_var}], ` : ''}${TIMESTAMP(var_name)}`
}

export const ORDER_QUERY = (var_name) => {
  return ` ORDER BY ${TIMESTAMP(var_name)} ASC;`
}

export let query = async (q: string) => {
  try {
    
    let result = await _g.sql.query(q) 
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

export let convert_general_grouped_with_users = (result) => {
  let data = result

  // Go through the array from the query and map it with the data we need
  data = data.map(x => {
    const from = Object.values(x)[0]
    let metadata:any = Object.values(x)[1]

    // If the json is an array
    if(metadata.substring(0, 1) == '[') {
      metadata = JSON.parse(metadata)[1]
    } else {
      metadata = JSON.parse(metadata)
    }
    
    const time = Object.values(x)[2]
    return {
      from,
      app: metadata['app'],
      timestamp: moment.utc(`${time[0]}-${time[1] < 10 ? '0' + time[1] : time[1]}-${time[2] < 10 ? '0' + time[2] : time[2]}`).toDate(),
    }
  })

  // Filter out the current day
  data = data.filter(x => moment.utc(x.timestamp).format('YYYY-MM-D') !== moment.utc().format('YYYY-MM-D'))

  // Group by app
  data = _(data).groupBy(x => x.app).value()

  let new_data = {}
  // Go through each app
  for(let app in data) {
    // Group data in app by timestamp .orderBy(['from'], ['asc'])
    data[app] = _(data[app]).groupBy(x => moment.utc(x.timestamp).toISOString()).value()

    // Go through each timestamp and create the structure we need
    for(let timestamp in data[app]) {
      let timeframe = data[app][timestamp]
      if(!new_data[app]) new_data[app] = []
      const users = Array.from(new Set(timeframe.map(x => x.from)))
      new_data[app].push({ value: users.length, timestamp, users })
    }
  }

  return new_data
}