import * as db_data from '../database/data.db'
import * as _g from '../_g'

export let index = async (req, res, next) => {
  return res.status(200).send({ data_types: _g.data_type })
}