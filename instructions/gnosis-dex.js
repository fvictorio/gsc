const fs = require('fs')
const shell = require('shelljs')

const { createEthersInstance, readJson } = require('../utils')

shell.config.fatal = true
shell.config.verbose = true

const name = 'gnosis-dex'
const repositoryUrl = 'https://github.com/gnosis/dex-contracts.git'

async function execute(config) {
  const commit = config.commit || 'master'

  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('yarn')
  shell.exec('./node_modules/.bin/truffle migrate --network development')

  const BatchExchangeArtifact = readJson('./build/contracts/BatchExchange.json')
  const BatchExchange = createEthersInstance(BatchExchangeArtifact)

  shell.cd(originalPwd)

  return {
    BatchExchange,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
