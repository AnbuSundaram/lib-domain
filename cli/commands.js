const path = require('path')
const readPkgUp = require('read-pkg-up')
const execSh = require('exec-sh').promise
const writeYaml = require('../serverless/write-yaml')

module.exports = {
  writeServerless,
  runOffline
}

async function writeServerless ({ findFunctions, domain, client, stage }) {
  const { path: pkgPath } = await readPkgUp()
  const pkgBase = path.dirname(pkgPath)
  writeYaml(domain, {
    clientId: client,
    stage,
    base: pkgBase,
    findFunctions: !findFunctions
      ? undefined
      : (...args) => require(path.join(pkgBase, findFunctions))(...args)
  })
}

async function runOffline (options) {
  const { path: pkgPath } = await readPkgUp()
  await writeServerless(options)
  return execSh('npx sls offline start', {
    cwd: path.dirname(pkgPath)
  })
}
