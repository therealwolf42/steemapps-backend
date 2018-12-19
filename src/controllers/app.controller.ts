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
  let { approved, sort, order, time, name, category, type } = req.query
  if(approved === 'false') approved = false
  if(approved === 'true') approved = true

  let apps = await db_app.find_approved(approved, sort, order, time, name, type, category)
  return res.status(200).send({ apps })
}