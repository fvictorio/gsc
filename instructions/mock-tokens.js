const fs = require('fs')
const shell = require('shelljs')

const { createEthersInstance, readJson } = require('../utils')

shell.config.fatal = true
shell.config.verbose = true

const name = 'mock-tokens'
const repositoryUrl = 'https://github.com/fvictorio/mock-tokens.git'

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

  const ERC20FactoryArtifact = readJson('./build/contracts/ERC20Factory.json')

  const ERC20Factory = createEthersInstance(ERC20FactoryArtifact)

  shell.cd(originalPwd)

  return {
    ERC20Factory,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
