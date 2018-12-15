import * as _g from '../../_g'
import * as db_app from '../../database/app.db'
import { TIME_GROUP_QUERY } from '../queries/query';

export const create_initial_apps = async () => {
  let smartsteem = await db_app.create(
    'smartsteem', 'Smartsteem.com', 'Investment & Promotion service on Steem', 'smartsteem',
    [
      {
        name: 'smartsteem',
        account_types: ['transfer', 'curation']
      }
    ],
    '', 'https://smartsteem.com', {}, 'live',
    _g.category.utility, ['steem'], [], _g.app_type.app)

  let steemmonsters = await db_app.create(
    'steemmonsters', 'Steem Monsters', 'Trading Card Game on the blockchain', 'steemmonsters',
    [
      {
        name: 'steemmonsters',
        account_types: ['transfer', 'curation']
      }
    ],
    '', 'https://steemmonsters.com', {}, 'live',
    _g.category.games, ['games', 'steemmonsters', 'tcg'], ['sm_'], _g.app_type.dapp)

  let dtube = await db_app.create(
    'dtube', 'DTube', 'Decentralized video platform', 'dtube',
    [
      {
        name: 'dtube',
        account_types: ['meta', 'benefactor', 'curation']
      },
      {
        name: 'dtube.rewards',
        account_types: ['benefactor', 'curation']
      }
    ],
    '', 'https://d.tube', {}, 'live',
    _g.category.entertainment, ['interface', 'video', 'platform'], [], _g.app_type.interface)

  let magicdice = await db_app.create(
    'magicdice', 'Magic Dice', 'Provably fair and transparent dice game', 'magicdice',
    [
      {
        name: 'magicdice',
        account_types: ['transfer']
      }
    ],
    '', 'https://magic-dice.com', {}, 'live', _g.category.gambling,
    ['gambling', 'games', 'dice'], ['dice'], _g.app_type.dapp)

  let steempeak = await db_app.create(
    'steempeak', 'Steempeak', 'The intuitive way to experience everything Steem', 'steempeak',
    [
      {
        name: 'steempeak',
        account_types: ['benefactor', 'meta']
      }
    ],
    '', 'https://steempeak.com/', {}, 'live', _g.category.social,
    ['interface', 'steem', 'community'], [], _g.app_type.interface)

  let partiko = await db_app.create(
    'partiko', 'Partiko', 'Fast and beautiful Steem on the go', 'partiko',
    [
      {
        name: 'partiko',
        account_types: ['benefactor', 'meta', 'curation']
      }
    ], '', 'https://partiko.app', {}, 'live', _g.category.social,
    ['app', 'steem', 'community'], [], _g.app_type.interface)

  let esteem = await db_app.create(
    'esteem', 'Esteem', 'eSteem mobile and desktop app for Steem Platform', 'esteemapp',
    [
      {
        name: 'esteemapp',
        account_types: ['benefactor', 'curation']
      },
      {
        name: 'esteem',
        account_types: ['meta']
      }
    ],
    '', 'https://esteem.app', {}, 'live', _g.category.social,
    ['app', 'steem', 'community'], [], _g.app_type.interface)

  let busy = await db_app.create(
    'busy', 'Busy', 'Next-Gen Social & Communication Open Platform of Apps/Blockchains', 'busy.org',
    [
      {
        name: 'busy.org',
        account_types: ['benefactor']
      },
      {
        name: 'busy',
        account_types: ['meta']
      },
      {
        name: 'busy.pay',
        account_types: ['curation']
      }
    ],
    '', 'https://busy.org', {}, 'live', _g.category.social,
    ['app', 'steem', 'community'], [], _g.app_type.interface)

  let steemhunt = await db_app.create(
    'steemhunt',
    'Steemhunt',
    'Daily Ranking for Effortlessly Cool Products That Rewards Hunters',
    'steemhunt',
    [
      {
        name: 'steemhunt',
        account_types: ['benefactor', 'meta', 'curation']
      },
      {
        name: 'steemhunt.fund',
        account_types: ['benefactor']
      },
      {
        name: 'steemhunt.pay',
        account_types: ['benefactor']
      }
    ],
    '', 'https://steemhunt.com', {}, 'live', _g.category.entertainment,
    ['app', 'steem', 'community', 'product hunt'], [], _g.app_type.dapp)

  let steempress = await db_app.create(
    'steempress', 'Steempress', 'A WordPress plugin connecting WordPress and Steem', 'steempress',
    [
      {
        name: 'steempress',
        account_types: ['benefactor', 'meta', 'curation']
      },
      {
        name: 'steempress-io',
        account_types: ['benefactor', 'curation']
      }
    ],
    '', 'https://wordpress.org/plugins/steempress', {}, 'live', _g.category.utility,
    ['plugin', 'steem', 'wordpress', 'blogging'], [], _g.app_type.app)

  let steepshot = await db_app.create('steepshot', 'Steepshot', 'Share moments. Earn coins', 'steepshot',
    [
      {
        name: 'steepshot',
        account_types: ['benefactor', 'meta', 'curation']
      },
      {
        name: 'steepshot.fund',
        account_types: ['benefactor', 'curation']
      },
      {
        name: 'steepshot.pay',
        account_types: ['benefactor', 'curation']
      }
    ], '', 'https://steepshot.io', {},
    'live', _g.category.social, ['app', 'steem', 'blogging'], [], _g.app_type.interface)

  let dclick = await db_app.create(
    'dclick', 'Dclick', 'An Incentivized Ad platform by Proof of Click', 'dclick',
    [
      {
        name: 'dclick',
        account_types: ['benefactor', 'meta', 'curation']
      }
    ],
    '', 'https://www.dclick.io', {}, 'live', _g.category.social,
    ['app', 'steem', 'adds'], [], _g.app_type.app)

  let fundition = await db_app.create(
    'fundition', 'Fundition', 'Next-generation, decentralized, peer-to-peer crowdfunding and collaboration platform', 'fundition',
    [
      {
        name: 'fundition',
        account_types: ['benefactor', 'meta', 'curation']
      }
    ],
    '', 'https://fundition.io', {}, 'live', _g.category.social,
    ['fundition', 'steem', 'crowdfunding'], [], _g.app_type.dapp)

  let steemit = await db_app.create(
    'steemit', 'Steemit', 'First interface and app on Steem', 'steemit',
    [
      {
        name: 'steemit',
        account_types: ['meta']
      }
    ],
    '', 'https://steemit.com', {}, 'live', _g.category.social,
    ['steem', 'frontend', 'app'], [], _g.app_type.interface)

  let musing = await db_app.create(
    'musing', 'Musing', 'Ask Questions. Write Answers. Earn Cryptocurrency.', 'musing',
    [
      {
        name: 'musing',
        account_types: ['benefactor', 'meta', 'curation']
      }
    ],
    '', 'https://musing.io', {}, 'live', _g.category.social,
    ['steem', 'frontend', 'app'], [], _g.app_type.interface)

  let tasteem = await db_app.create(
    'tasteem', 'Tasteem', 'Write your own restaurant guide for special rewards.', 'tasteem',
    [
      {
        name: 'tasteem',
        account_types: ['benefactor', 'meta', 'curation']
      }
    ],
    '', 'https://tasteem.io', {}, 'live', _g.category.social,
    ['steem', 'frontend', 'app'], [], _g.app_type.interface)

  let utopian = await db_app.create(
    'utopian', 'Utopian', 'Earn rewards by contributing to your favorite Open Source projects!', 'utopian-io',
    [
      {
        name: 'utopian-io',
        account_types: ['benefactor', 'meta', 'curation']
      }
    ],
    '', 'https://utopian.io', {}, 'live', _g.category.social,
    ['steem', 'open-source', 'app'], [], _g.app_type.dapp)

  for (let app of await db_app.find_all()) {
    app.approved = true
    await app.save()
  }
}