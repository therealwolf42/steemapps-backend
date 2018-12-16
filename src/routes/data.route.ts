const router = require('express-promise-router')()
const { celebrate } = require('celebrate')
import * as controller from '../controllers/data.controller'
import schemas from '../validation/schemas/data.schema'

router.route('/')
  .get(celebrate(schemas.get), controller.get_data)

export default router