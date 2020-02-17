const fs = require('fs')
const shell = require('shelljs')

const { createEthersInstance, readJson } = require('../utils')

shell.config.fatal = true
shell.config.verbose = true

const name = 'realitio'
const repositoryUrl = 'https://github.com/realitio/realitio-contracts.git'

async function execute(config) {
  const commit = config.commit || 'master'

  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('npm install')
  shell.cd('truffle')
  shell.exec('../node_modules/.bin/truffle deploy --network development')
  const RealitioArtifact = readJson('./build/contracts/Realitio.json')

  const Realitio = createEthersInstance(RealitioArtifact)

  shell.cd(originalPwd)

  return {
    Realitio,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
