const fs = require('fs')
const shell = require('shelljs')

const { createEthersInstance, readJson } = require('../utils')

shell.config.fatal = true
shell.config.verbose = true

const name = 'gnosis-cpk'
const repositoryUrl = 'https://github.com/gnosis/contract-proxy-kit.git'

async function execute(config) {
  const commit = config.commit || 'master'

  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('npm install')
  shell.exec('./node_modules/.bin/truffle deploy --network development')
  const GnosisSafeArtifact = readJson('./build/contracts/GnosisSafe.json')
  const CpkFactoryArtifact = readJson('./build/contracts/CPKFactory.json')
  const MultiSendArtifact = readJson('./build/contracts/MultiSend.json')
  const DefaultCallbackHandlerArtifact = readJson(
    './build/contracts/DefaultCallbackHandler.json',
  )

  const GnosisSafe = createEthersInstance(GnosisSafeArtifact)
  const CpkFactory = createEthersInstance(CpkFactoryArtifact)
  const MultiSend = createEthersInstance(MultiSendArtifact)
  const DefaultCallbackHandler = createEthersInstance(
    DefaultCallbackHandlerArtifact,
  )

  shell.cd(originalPwd)
  return {
    GnosisSafe,
    CpkFactory,
    MultiSend,
    DefaultCallbackHandler,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
