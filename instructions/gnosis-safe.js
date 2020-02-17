const fs = require('fs')
const shell = require('shelljs')

const { createEthersInstance, readJson } = require('../utils')

shell.config.fatal = true
shell.config.verbose = true

const name = 'gnosis-safe'
const repositoryUrl = 'https://github.com/gnosis/safe-contracts.git'

async function execute(config) {
  const commit = config.commit || 'master'

  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('npm install')
  shell.exec('npm run install')
  shell.exec('./node_modules/.bin/truffle migrate --network development')

  const GnosisSafeArtifact = readJson('./build/contracts/GnosisSafe.json')
  const ProxyFactoryArtifact = readJson('./build/contracts/ProxyFactory.json')
  const CreateAndAddModulesArtifact = readJson(
    './build/contracts/CreateAndAddModules.json',
  )
  const MultiSendArtifact = readJson('./build/contracts/MultiSend.json')
  const StateChannelModuleArtifact = readJson(
    './build/contracts/StateChannelModule.json',
  )
  const DailyLimitModuleArtifact = readJson(
    './build/contracts/DailyLimitModule.json',
  )
  const SocialRecoveryModuleArtifact = readJson(
    './build/contracts/SocialRecoveryModule.json',
  )
  const WhitelistModuleArtifact = readJson(
    './build/contracts/WhitelistModule.json',
  )

  const GnosisSafe = createEthersInstance(GnosisSafeArtifact)
  const ProxyFactory = createEthersInstance(ProxyFactoryArtifact)
  const CreateAndAddModules = createEthersInstance(CreateAndAddModulesArtifact)
  const MultiSend = createEthersInstance(MultiSendArtifact)
  const StateChannelModule = createEthersInstance(StateChannelModuleArtifact)
  const DailyLimitModule = createEthersInstance(DailyLimitModuleArtifact)
  const SocialRecoveryModule = createEthersInstance(
    SocialRecoveryModuleArtifact,
  )
  const WhitelistModule = createEthersInstance(WhitelistModuleArtifact)

  shell.cd(originalPwd)

  return {
    GnosisSafe,
    ProxyFactory,
    CreateAndAddModules,
    MultiSend,
    StateChannelModule,
    DailyLimitModule,
    SocialRecoveryModule,
    WhitelistModule,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
