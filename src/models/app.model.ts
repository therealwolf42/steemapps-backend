import * as mongoose from 'mongoose'
import * as moment from 'moment'
export type AccountType = 'main' | 'transfer' | 'meta' | 'curation' | 'benefactor'

export type AppType = 'app' | 'dapp' | 'interface'

const schema = new mongoose.Schema({
  approved: { type: Boolean, default: false, required: true },
  display_name: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  main_account: String,
  accounts: [
    {
      _id:false,
      id: Number,
      name: String,
      benefactor: { type: Boolean, default: false },
      curation: { type: Boolean, default: false },
      transfer: { type: Boolean, default: false },
      transfer_only_dau: { type: Boolean, default: false },
      meta: { type: Boolean, default: false },
      delegation: { type: Boolean, default: false },
      posting: { type: Boolean, default: false },
      logo: { type: Boolean, default: false },
      account_types: Array
    }
  ],
  app_type: { type: String, required: true },
  short_description: { type: String, required: false },
  description: { type: String, required: true },
  logo: { type: String },
  link: { type: String },
  ref_link: { type: String },
  social: {
    type: Object,
    default: {
      github: '',
      discord: '',
      twitter: '',
      medium: '',
      reddit: ''
    }
  },
  status: String,
  category: { type: String, required: true },
  tags: [],
  custom_jsons: [],
  isFeatured: { type: Boolean, default: false },
  steempower: {
    effective: { type: Number, default: 0 },
    own: { type: Number, default: 0 }
  },
  last_update: Date,
  last_update_data: { type: String, default: moment.utc().subtract(62, 'days').toISOString() },
  createdAt: { type: Date, required: true, default: Date.now },
  rank: {
    last_day: { type: Number, default: 0 },
    before_last_day: { type: Number, default: 0 },
    last_week: { type: Number, default: 0 },
    before_last_week: { type: Number, default: 0 },
    last_month: { type: Number, default: 0 },
    before_last_month: { type: Number, default: 0 }
  },
  dau: {
    last_day: { type: Number, default: 0 },
    before_last_day: { type: Number, default: 0 },
    change_last_day: { type: Number, default: 0 },
    last_week: { type: Number, default: 0 },
    before_last_week: { type: Number, default: 0 },
    change_last_week: { type: Number, default: 0 },
    last_month: { type: Number, default: 0 },
    before_last_month: { type: Number, default: 0 },
    change_last_month: { type: Number, default: 0 },
    last_month_array: []
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
      change_last_month: { type: Number, default: 0 },
      last_month_array: []
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
      change_last_month: { type: Number, default: 0 },
      last_month_array: []
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
      change_last_month: { type: Number, default: 0 },
      last_month_array: []
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
    change_last_month: { type: Number, default: 0 },
    last_month_array: []
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
      change_last_month: { type: Number, default: 0 },
      last_month_array: []
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
      change_last_month: { type: Number, default: 0 },
      last_month_array: []
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
      change_last_month: { type: Number, default: 0 },
      last_month_array: []
    }
  },
})

export const App = mongoose.model('app', schema)