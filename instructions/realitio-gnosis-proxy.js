const fs = require('fs')
const shell = require('shelljs')

const { createEthersInstance, readJson } = require('../utils')

shell.config.fatal = true
shell.config.verbose = true

const name = 'realitio-gnosis-proxy'
const repositoryUrl = 'https://github.com/fvictorio/realitio-gnosis-proxy.git'

async function execute(config, env) {
  const commit = config.commit || 'master'

  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('yarn')

  shell.env.CONDITIONAL_TOKENS_ADDRESS =
    env['conditional-tokens'].conditionalTokens.address
  shell.env.REALITIO_ADDRESS = env.realitio.realitio.address

  shell.exec('./node_modules/.bin/truffle deploy --network development')

  const RealitioGnosisProxyArtifact = readJson(
    './build/contracts/RealitioProxy.json',
  )
  const RealitioGnosisProxy = createEthersInstance(RealitioGnosisProxyArtifact)

  shell.cd(originalPwd)

  return {
    RealitioGnosisProxy,
  }
}

module.exports = {
  execute,
  dependsOn: ['conditional-tokens', 'realitio'],
}
