import * as celebrate from 'celebrate'
const Joi: any = celebrate.Joi

import * as _g from '../../_g'

export default {
  get: {
    query: Joi.object().keys({
      app: Joi.string().required(),
      account: Joi.string(),
      data_type: Joi.string().valid(
        'volume_transfers_sbd', 'volume_transfers_steem', 'volume_meta', 'tx_transfers_sbd', 'tx_transfers_steem', 'tx_custom', 'dau_transfer',
        'dau_meta', 'dau_custom', 'tx_meta', 'rewards_benefactor_sbd', 'rewards_benefactor_steem', 'rewards_benefactor_vests', 'rewards_curation'
        )
    })
  }
}