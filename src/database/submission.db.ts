import * as Model from './../models/submission.model'

export const find = async (name?: string) => {
  const q:any = {}
  if(name) q.name = name
  return await Model.Submission.find(q)
}

export const find_approved = async (name?: string) => {
  const q:any = { approved: true }
  if(name) q.name = name
  return await Model.Submission.find(q)
}

