import * as dotenv from 'dotenv'; dotenv.config({ path: '.env' });

import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as celebrate from 'celebrate'
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'
import * as main from './index'

import route_apps from './routes/app.route'
import route_data from './routes/data.route'
import route_categories from './routes/categories.route'
import route_app_types from './routes/app_types.route'
import route_data_types from './routes/data_types.route'

const app = express()

let port = process.env.port || 5000
app.set('port', port)

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

// Enable later
//app.enable("trust proxy") // API Endpoint behind proxy
//const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 1000 });
//app.use(limiter)

app.use('/api/apps', route_apps)
app.use('/api/data', route_data)
app.use('/api/categories', route_categories)
app.use('/api/app_types', route_app_types)
app.use('/api/data_types', route_data_types)
app.use(celebrate.errors())

app.listen(app.get('port'), async () => {
  console.log("App is running at on port " + app.get('port') + " in " + app.get('env') + " mode")
  main.start()
})


module.exports = app
