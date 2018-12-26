import * as convert from '../helpers/convert'

import * as db_app from '../database/app.db'
import * as SubmissionModel from '../models/submission.model'

export let get_apps = async (req, res) => {
  let { approved, sort, order, time, name, category, type } = req.query
  if(approved === 'false') approved = false
  if(approved === 'true') approved = true

  let apps = await db_app.find_approved(approved, sort, order, time, name, type, category)
  return res.status(200).send({ apps })
}

export const get_app = async (req, res) => {
  let { name } = req.params
  const apps = await db_app.find(name)
  const app = apps.length > 0 ? apps[0] : {}
  return res.status(200).send({ app })
}

export const submit = async (req, res) => {
  let { name, link, image, product_screenshot, description, short_description, status, app_type, category, social, accounts, custom_jsons } = req.body
  let display_name = name 
  name = convert.clean_string(name)

  let message = ''

  await SubmissionModel.Submission.create({
    display_name, name, accounts, description, short_description, app_type, image, product_screenshot, link, social, status, category, custom_jsons
  })

  return res.status(200).send({ message })
}