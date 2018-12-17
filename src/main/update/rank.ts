import * as db_app from '../../database/app.db'
import * as _ from 'lodash'

export const update_rank = async () => {
  try {
    let apps = await db_app.find_approved(true)
    let rankings = []
    let i = 0
    for (let app of apps) {
      rankings[i] = { name: app.name, data: [] }
      for (let sort_type of ['dau', 'tx', 'volume_sbd', 'volume_steem', 'rewards_sbd', 'rewards_steem', 'steempower_effective']) {
        for (let time of ['last_day', 'last_week', 'last_month']) {
          rankings[i].data.push({ time, sort_type, points: await get_ranking(app.name, sort_type, time) })
        }
      }
      i += 1; 
    }

    let new_rankings = []
    for (let app of rankings) {
      let rank = {}
      for (let time of ['last_day', 'last_week', 'last_month']) {
        let data = app.data.filter(x => x.time === time)
        rank[time] = data.reduce((a, b) => {
          return a.points || a.points === 0 ? a.points + b.points : a + b.points
        })
        
        rank['name'] = app.name
      }
      new_rankings.push(rank)
    }

    let ranks = {}
    for (let time of ['last_day', 'last_week', 'last_month']) {
      ranks[time] = _(new_rankings).orderBy([time], ['desc']).map(x => x.name).value()
    }

    //console.log(rankings[0].data)
    for (let app of apps) {
      for (let time of ['last_day', 'last_week', 'last_month']) {
        app.rank[time] = ranks[time].indexOf(app.name) + 1
      }
      app.markModified('rank')
      await app.save()
    }
  } catch (error) {
    console.error('update_rank', error)
  }
}

const get_ranking = async (app_name, sort_type, time, order = 'desc') => {
  let apps = await db_app.find_approved_lean(true, sort_type, order, time)
  let app = apps.filter(x => x.name === app_name)[0]

  let sum = 0
  const i = sort_type.indexOf('_')
  if (i > -1) {
    if (sort_type.includes('steempower')) {
      sum = app[sort_type.substring(0, i)][sort_type.substring(i + 1, sort_type.length)]
    } else {
      sum = app[sort_type.substring(0, i)][sort_type.substring(i + 1, sort_type.length)][time]
    }
  } else {
    sum = app[sort_type][time]
  }
  let weight = calculate_weight_for_sort_type(sum, sort_type)
  return weight
}

const calculate_weight_for_sort_type = (value, sort_type) => {
  if(!value) return 0
  let point = 1

  if (sort_type === 'dau') {
    point = 20
  } else if (sort_type === 'tx') {
    point = 0.35
  } else if (sort_type.includes('volume') || sort_type.includes('rewards')) {
    point = 0.2
  } else if (sort_type.includes('steempower')) {
    point = 0.001
  }
  return point * value
}