import * as db_data from '../database/data.db'

export let get_data = async (req, res, next) => {
  let { app, account, data_type, detailed } = req.query
  
  detailed = false // force lean for now
  let data = detailed ? await db_data.find_intern(app, account, data_type) : await db_data.find_extern(app, account, data_type)
  return res.status(200).send({ data })
}