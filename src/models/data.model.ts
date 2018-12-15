import * as mongoose from 'mongoose'

const schema = new mongoose.Schema({
  app: { type: String, required: true },
  account: { type: String, required: false },
  data_type: { type: String, required: true },
  data: [{
    value: { type: Number, required: true },
    timestamp: { type: Date, required: true }
  }],
  lastTimestamp: String
})

export const Data = mongoose.model('data', schema)