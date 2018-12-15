const router = require('express-promise-router')()
import * as celebrate from 'celebrate'
import * as controller from '../controllers/app.controller'

router.route('/')
  .get(controller.get_apps)

export default router