import * as mongoose from 'mongoose'
import * as moment from 'moment'

const schema = new mongoose.Schema({
  approved: { type: Boolean, default: false },
  display_name: { type: String, required: true },
  name: { type: String, required: true },
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
      logo: { type: Boolean, default: false }
    }
  ],
  app_type: { type: String, required: true },
  short_description: { type: String, required: false },
  description: { type: String, required: true },
  logo: { type: String },
  link: { type: String },
  ref_link: { type: String },
  social: {
    github: String,
    discord: String,
    twitter: String,
    medium: String,
    reddit: String,
  },
  status: String,
  category: { type: String, required: true },
  tags: [],
  custom_jsons: [],
  createdAt: { type: Date, required: true, default: Date.now }
})

export const Submission = mongoose.model('submission', schema)