import * as mongoose from 'mongoose'
import * as moment from 'moment'
export type AccountType = 'main' | 'transfer' | 'meta' | 'curation' | 'benefactor'

export type AppType = 'app' | 'dapp' | 'interface'

const schema = new mongoose.Schema({
  approved: { type: Boolean, default: false, required: true },
  display_name: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  main_account: String,
  accounts: [{
    name: String,
    account_types: []
  }
  ],
  app_type: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  link: { type: String },
  ref_link: String,
  social: {
    discord: String,
    twitter: String,
    medium: String,
    reddit: String,
  },
  rank: {
    last_day: { type: Number, default: 0 },
    before_last_day: { type: Number, default: 0 },
    last_week: { type: Number, default: 0 },
    before_last_week: { type: Number, default: 0 },
    last_month: { type: Number, default: 0 },
    before_last_month: { type: Number, default: 0 }
  },
  status: String,
  category: { type: String, required: true },
  tags: [],
  custom_jsons: [],
  dau: {
    last_day: { type: Number, default: 0 },
    before_last_day: { type: Number, default: 0 },
    change_last_day: { type: Number, default: 0 },
    last_week: { type: Number, default: 0 },
    before_last_week: { type: Number, default: 0 },
    change_last_week: { type: Number, default: 0 },
    last_month: { type: Number, default: 0 },
    before_last_month: { type: Number, default: 0 },
    changeLastMonth: { type: Number, default: 0 }
  },
  volume: {
    sbd: {
      last_day: { type: Number, default: 0 },
      before_last_day: { type: Number, default: 0 },
      change_last_day: { type: Number, default: 0 },
      last_week: { type: Number, default: 0 },
      before_last_week: { type: Number, default: 0 },
      change_last_week: { type: Number, default: 0 },
      last_month: { type: Number, default: 0 },
      before_last_month: { type: Number, default: 0 },
      changeLastMonth: { type: Number, default: 0 }
    },
    steem: {
      last_day: { type: Number, default: 0 },
      before_last_day: { type: Number, default: 0 },
      change_last_day: { type: Number, default: 0 },
      last_week: { type: Number, default: 0 },
      before_last_week: { type: Number, default: 0 },
      change_last_week: { type: Number, default: 0 },
      last_month: { type: Number, default: 0 },
      before_last_month: { type: Number, default: 0 },
      changeLastMonth: { type: Number, default: 0 }
    },
    all: {
      last_day: { type: Number, default: 0 },
      before_last_day: { type: Number, default: 0 },
      change_last_day: { type: Number, default: 0 },
      last_week: { type: Number, default: 0 },
      before_last_week: { type: Number, default: 0 },
      change_last_week: { type: Number, default: 0 },
      last_month: { type: Number, default: 0 },
      before_last_month: { type: Number, default: 0 },
      changeLastMonth: { type: Number, default: 0 }
    }
  },
  tx: {
    last_day: { type: Number, default: 0 },
    before_last_day: { type: Number, default: 0 },
    change_last_day: { type: Number, default: 0 },
    last_week: { type: Number, default: 0 },
    before_last_week: { type: Number, default: 0 },
    change_last_week: { type: Number, default: 0 },
    last_month: { type: Number, default: 0 },
    before_last_month: { type: Number, default: 0 },
    changeLastMonth: { type: Number, default: 0 }
  },
  rewards: {
    sbd: {
      last_day: { type: Number, default: 0 },
      before_last_day: { type: Number, default: 0 },
      change_last_day: { type: Number, default: 0 },
      last_week: { type: Number, default: 0 },
      before_last_week: { type: Number, default: 0 },
      change_last_week: { type: Number, default: 0 },
      last_month: { type: Number, default: 0 },
      before_last_month: { type: Number, default: 0 },
      changeLastMonth: { type: Number, default: 0 }
    },
    steem: {
      last_day: { type: Number, default: 0 },
      before_last_day: { type: Number, default: 0 },
      change_last_day: { type: Number, default: 0 },
      last_week: { type: Number, default: 0 },
      before_last_week: { type: Number, default: 0 },
      change_last_week: { type: Number, default: 0 },
      last_month: { type: Number, default: 0 },
      before_last_month: { type: Number, default: 0 },
      changeLastMonth: { type: Number, default: 0 }
    },
    all: {
      last_day: { type: Number, default: 0 },
      before_last_day: { type: Number, default: 0 },
      change_last_day: { type: Number, default: 0 },
      last_week: { type: Number, default: 0 },
      before_last_week: { type: Number, default: 0 },
      change_last_week: { type: Number, default: 0 },
      last_month: { type: Number, default: 0 },
      before_last_month: { type: Number, default: 0 },
      changeLastMonth: { type: Number, default: 0 }
    }
  },
  isFeatured: { type: Boolean, default: false },
  steempower: {
    effective: { type: Number, default: 0 },
    own: { type: Number, default: 0 }
  },
  last_update: Date,
  last_update_data: { type: String, default: moment.utc().subtract(2, 'days').toISOString() },
  createdAt: { type: Date, required: true, default: Date.now }
})

export const App = mongoose.model('app', schema)