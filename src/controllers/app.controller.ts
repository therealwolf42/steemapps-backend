/*import * as cast from '../helpers/cast'//import * as db_account from '../database/account.db'
import { create_user_token } from '../helpers/token'

export let login = async (req, res, next) => {
  let { name } = req.body

  let account = //await db_account.find_or_create(name)
  if (!account.api_token) {
    let token: String = create_user_token(name)
    account.api_token = token
    await account.save()
  }

  res.status(200).send({ name, api_token: account.api_token })
}*/

import * as db_app from '../database/app.db'

export let create_app = async (req, res, next) => {
  let { name, display_name, description, main_account, accounts, image, link, social, status, category, tags, custom_jsons, isDapp } = req.body

  let app = await db_app.find(name)
  if (app) return res.status(400).send({ error: 'App already existing.' })

  app = await db_app.create(name, display_name, description, main_account, accounts, image, link, social, status, category, tags, custom_jsons, isDapp)

  if(app) {
    res.status(200).send({ app })
  } else {
    res.status(400).send({ error: 'Something went wrong.' })
  }
}

export let get_apps = async (req, res) => {
  let { approved, sort, order, time, name, app_type, category } = req.query
  if(approved === 'false') approved = false
  if(approved === 'true') approved = true

  let apps = await db_app.find_approved(approved, sort, order, time, name, app_type, category)
  return res.status(200).send({ apps })
}