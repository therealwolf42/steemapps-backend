import * as mongoose from 'mongoose'

const schema_lean = new mongoose.Schema({
  app: { type: String, required: true },
  account: { type: String, required: false },
  data_type: { type: String, required: true },
  data: [{
    _id:false,
    value: { type: Number, required: true },
    timestamp: { type: Date, required: true }
  }],
  lastTimestamp: String
})

const schema_detail = new mongoose.Schema({
  app: { type: String, required: true },
  account: { type: String, required: false },
  data_type: { type: String, required: true },
  data: [{
    _id:false,
    value: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    users: []
  }],
  lastTimestamp: String
})

export const DataLean = mongoose.model('data_lean', schema_lean)
export const DataDetailed = mongoose.model('data_detail', schema_detail)