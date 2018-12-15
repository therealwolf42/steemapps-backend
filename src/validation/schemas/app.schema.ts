import * as celebrate from 'celebrate'
const Joi: any = celebrate.Joi

export default {
  index: {
    query: Joi.object().keys({
      all: Joi.boolean(),
      approved: Joi.boolean(),
      sort: Joi.string().valid('rank', 'dau', 'tx', 'volume_sbd', 'volume_steem', 'rewards_sbd', 'rewards_steem'),
      order: Joi.string().valid('asc', 'desc'),
      time: Joi.string().valid('last_day', 'last_week', 'last_month')
    })
  }
}