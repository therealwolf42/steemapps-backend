import * as db_data from '../database/data.db'

export let get_data = async (req, res, next) => {
  let { app, account, data_type } = req.query

  let data = await db_data.find(app, account, data_type)
  return res.status(200).send({ data })
}