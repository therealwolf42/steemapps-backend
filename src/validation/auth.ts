import * as dsteem from 'dsteem'

import * as cast from '../helpers/cast'

export let authenticate_account = () => {
  return async (req, res, next) => {
    try {
      let { name, key } = req.body
      let account = await cast.get_account(name)
      if (account) {
        let posting_key = account.posting.key_auths[0][0]
        if(dsteem.PrivateKey.fromString(key).createPublic().toString() === posting_key) {
          return next()
        }
      }
      return res.status(400).json({ result: 'Unauthorized' })
    } catch (error) {
      console.error('authenticate_account', error)
      return res.status(400).json({ result: 'Unauthorized' })
    }
  }
}