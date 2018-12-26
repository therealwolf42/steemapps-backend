const router = require('express-promise-router')()
const { celebrate } = require('celebrate')
import * as controller from '../controllers/data_types.controller'

router.route('/')
  .get(controller.index)


export default router