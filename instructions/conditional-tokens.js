const fs = require('fs')
const shell = require('shelljs')

const { createEthersInstance, readJson } = require('../utils')

shell.config.fatal = true
shell.config.verbose = true

const name = 'conditional-tokens'
const repositoryUrl =
  'https://github.com/gnosis/conditional-tokens-contracts.git'

async function execute(config) {
  const commit = config.commit || 'master'

  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('npm install')
  shell.exec('./node_modules/.bin/truffle deploy --network local')
  const ConditionalTokensArtifact = readJson(
    './build/contracts/ConditionalTokens.json',
  )
  const ConditionalTokens = createEthersInstance(ConditionalTokensArtifact)
  shell.cd(originalPwd)

  return {
    ConditionalTokens,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
