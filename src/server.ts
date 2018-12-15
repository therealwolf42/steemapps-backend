import * as dotenv from 'dotenv'; dotenv.config({ path: '.env' });

import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as celebrate from 'celebrate'
import * as helmet from 'helmet'
import * as main from './index'

import route_apps from './routes/app.route'

const app = express()
let port = process.env.port || 5000
app.set('port', port)

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.use('/api/apps', route_apps)

app.use(celebrate.errors())

app.listen(app.get('port'), async () => {
  console.log("App is running at on port " + app.get('port') + " in " + app.get('env') + " mode")
  main.start()
})


module.exports = app
