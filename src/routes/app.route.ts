const router = require('express-promise-router')()
const { celebrate } = require('celebrate')
import * as controller from '../controllers/app.controller'
import schemas from '../validation/schemas/app.schema'

router.route('/')
  .get(celebrate(schemas.get_multiple), controller.get_apps)

router.route('/:name')
  .get(controller.get_app)


router.route('/submit/new')
  .post(celebrate(schemas.submit), controller.submit)

export default router