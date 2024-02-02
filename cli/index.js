#!/usr/bin/env node

const meow = require('meow')
const domainManifest = require('../manifest')

const cli = meow(
  `
  Usage
    $ ydv-lib-domain write-yaml --stage=<stage> --domain=<domainId> --client=<clientId>
    $ ydv-lib-domain offline --domain=<domainId> --client=<clientId>

  Options
    --stage Stage for deployment, defaults to offline
    --client Client id
)}
    --domain Domain id, one of ${JSON.stringify(Object.keys(domainManifest))}
    --find-functions Path to custom find-functions file to run instead of default (used by some domains)

  Examples
    ydv-lib-domain write-yaml --stage=develop --client=eddiebauer
`,
  {
    flags: {
      domain: {
        type: 'string'
      },
      ci: {
        type: 'boolean'
      },
      stage: {
        type: 'string'
      },
      client: {
        type: 'string'
      }
    }
  }
)

main()

async function main () {
  if (!domainManifest[cli.flags.domain]) {
    console.log(
      '--domain argument required, must be one of ' +
        JSON.stringify(Object.keys(domainManifest))
    )
    process.exit(1)
  }

  if (!cli.flags.client) {
    console.log('--client argument required')
    process.exit(1)
  }

  process.env.YDV_CLIENT_ID = cli.flags.client

  const commands = require('./commands')
  const cmd = cli.input[0]
  if (cmd === 'write-yaml') {
    commands.writeServerless(cli.flags)
  } else if (cmd === 'offline') {
    commands.runOffline(cli.flags)
  } else {
    cli.showHelp()
  }
}
