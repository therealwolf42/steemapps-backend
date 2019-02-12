import * as moment from 'moment'
import * as _ from 'lodash'

export const objects_to_arr = (objects, attribute = 'name', max_num = 50) => {
  let num = max_num - 1
  let list = objects.map(e => { return e[attribute] })
  let list_arr = []
  let max = list.length / max_num
  for (let i = 0; i < Math.floor(max) + 1; i++) {
    let splice = list.splice(0, num)
    if (splice.length <= 0) break
    list_arr[i] = splice
  }
  return list_arr
}

export const vests_to_sp = (vests: number|string, global_properties) => {
  if(typeof vests === 'string') vests = parseFloat(vests.replace(' VESTS', ''))
  return parseFloat((global_properties.total_vesting_fund * (vests / global_properties.total_vesting_shares)).toFixed(3))
}

export let add_values = (values) => {
  let x = {}
  for (let v of values) {
    for (let key of Object.keys(v)) {
      if (!x[key]) x[key] = 0
      x[key] += v[key]
    }
  }
  x = get_change(x)
  return x
}

export let add_values_total_users = (values) => {
  let x = {}
  for (let v of values) {
    for (let key of Object.keys(v)) {
      if (!x[key]) x[key] = 0
      x[key] += v[key]
    }
  }
  x = get_change(x)
  return x
}


export let get_change = (x: {}) => {
  for (let d of ['last_day', 'last_week', 'last_month']) {
    let current = x[d] || 0
    let before = x[`before_${d}`] || 0 
    let change = 0

    //x[`change_${d}`] = `${((x[d] / x[`before_${d}`] - 1) * 100).toFixed(2)}%`
    if(before === 0 || isNaN(before)) {
      change = parseFloat((current / 100).toFixed(3))
    } else {
      change = parseFloat((current / before).toFixed(3))
    }
    x[`change_${d}`] = isNaN(change) ? 0 : change
  }
  return x
}

export let remove_duplicates = (arr: Array<string>) => {
  // Super slow - has to be fixed
  let duplicates = arr.filter(x => arr.filter(y => y === x).length > 1)
  let removed = []
  for(let d of duplicates) {
    if(removed.includes(d)) {
      continue
    }
    let i = arr.indexOf(d)
    arr.splice(i, 1)
    removed.push(d)
  }
  return arr
}

export let create_arr_of_arrays = (arr_arr) => {
  let arr = []
  for(let a of arr_arr) {
    arr = arr.concat(a)
  }
  return arr
}

export let create_grouped_array = (data, var_name = 'timestamp') => {
  return _(data).groupBy(x => moment.utc(x[var_name]).toISOString()).value()
}

export let create_sum_array_of_group = (arr) => {
  let values = []
  for (let timestamp in arr) {
    let value = 0
    for(let x of arr[timestamp]) {
      value += x.value ? x.value : 0
    }
    values.push({ value, timestamp })
  }
  return values
}

export let clean_string = (x) => {
  return x.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(' ', '').toLowerCase()
}