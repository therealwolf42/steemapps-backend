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

export let get_change = (x: {}) => {
  for (let d of ['last_day', 'last_week', 'last_month']) {
    let current = x[d] || 0
    let before = x[`before_${d}`] - 1 || 0

    //x[`change_${d}`] = `${((x[d] / x[`before_${d}`] - 1) * 100).toFixed(2)}%`
    x[`change_${d}`] = parseFloat((current / before).toFixed(3))
  }
  return x
}
