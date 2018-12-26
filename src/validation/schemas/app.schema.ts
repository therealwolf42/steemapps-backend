import * as celebrate from 'celebrate'
const Joi: any = celebrate.Joi

const socialSchema = Joi.object({
  github: Joi.string().allow(''),
  discord: Joi.string().allow(''),
  twitter: Joi.string().allow(''),
  medium: Joi.string().allow(''),
  reddit: Joi.string().allow(''),
  telegram: Joi.string().allow('')
}).required()

const accountSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  benefactor: Joi.boolean(),
  curation: Joi.boolean(),
  transfer: Joi.boolean(),
  transfer_only_dau: Joi.boolean().allow(''),
  meta: Joi.boolean(),
  delegation: Joi.boolean(),
  posting: Joi.boolean(),
  logo: Joi.boolean(),
  account_types: Joi.array()
}).required()

export default {
  get_multiple: {
    query: Joi.object().keys({
      name: Joi.string(),
      type: Joi.string().valid('app', 'dapp', 'interface', 'project'),
      category: Joi.string(),
      all: Joi.boolean(),
      approved: Joi.boolean(),
      sort: Joi.string().valid('rank', 'dau', 'tx', 'volume_sbd', 'volume_steem', 'rewards_sbd', 'rewards_steem'),
      order: Joi.string().valid('asc', 'desc'),
      time: Joi.string().valid('last_day', 'last_week', 'last_month')
    })
  },
  get: {
    query: Joi.object().keys({
      name: Joi.string().required()
    })
  },
  submit: {
    body: Joi.object().keys({
      name: Joi.string().allow(''),
      display_name: Joi.string().required(),
      link: Joi.string().required(),
      logo: Joi.string().allow(''),
      product_screenshot: Joi.string().allow(''),
      description: Joi.string().required(),
      short_description: Joi.string().required(),
      status: Joi.string().required(),
      app_type: Joi.string().required(),
      category: Joi.string().required(),
      social: socialSchema,
      accounts: Joi.array().items(accountSchema).required(),
      custom_jsons: Joi.array().items(Joi.string()).required()
    })
  }
}