import * as _ from 'lodash'
import { create_grouped_array } from '../../helpers/convert'
import * as ModelApp from '../../models/app.model'
import * as db_app from '../../database/app.db'
import * as db_submission from '../../database/submission.db'

export const convert_accepted_submissions = async () => {
  try {
    let submissions = await db_submission.find_approved()
    submissions = _(submissions).orderBy(['createdAt'], ['desc']).groupBy(x => x.name).value()
    //console.log(submissions)
    for (let name in submissions) {
      let approved = false
      for (let submission of submissions[name]) {
        if (approved) {
          await submission.remove()
          continue
        }

        let app = (await db_app.find(submission.name))[0]
        submission.approved = approved = true
        let submission_object = create_object(submission)
        if (app) {
          await change_existing_app(app, submission_object)
        } else {
          await ModelApp.App.create(submission_object)
        }
        await submission.remove()
      }
    }
  } catch (error) {
    console.error('convert_accepted_submissions', error)
  }
}

const ignore_keys = ['_id', '__v']

export const change_existing_app = async (app, submission) => {
  for (let key of Object.keys(submission)) {
    if (key === 'createdAt') {
      app['last_update'] = submission[key]
    } else {
      app[key] = submission[key]
    }
  }
  await app.save()
}

export const create_object = (submission) => {
  let x = {}
  for (let key of Object.keys(submission.toJSON())) {
    if (!ignore_keys.includes(key)) {
      x[key] = submission[key]
    }
  }
  return x
}