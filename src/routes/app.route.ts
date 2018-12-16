const router = require('express-promise-router')()
const { celebrate } = require('celebrate')
import * as controller from '../controllers/app.controller'
import schemas from '../validation/schemas/app.schema'

router.route('/')
  .get(celebrate(schemas.get), controller.get_apps)

export default router