const fs = require('fs')
const shell = require('shelljs')

shell.config.fatal = true
shell.config.verbose = true

const name = 'gnosis-safe'
const repositoryUrl = 'https://github.com/gnosis/safe-contracts.git'
const commit = 'development'

async function execute() {
  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('npm install')
  shell.exec('npm run install')
  shell.exec('./node_modules/.bin/truffle migrate --network development')
  const gnosisSafe = JSON.parse(
    fs.readFileSync('./build/contracts/GnosisSafe.json').toString(),
  )
  const proxyFactory = JSON.parse(
    fs.readFileSync('./build/contracts/ProxyFactory.json').toString(),
  )
  const createAndAddModules = JSON.parse(
    fs.readFileSync('./build/contracts/CreateAndAddModules.json').toString(),
  )
  const multiSend = JSON.parse(
    fs.readFileSync('./build/contracts/MultiSend.json').toString(),
  )
  const stateChannelModule = JSON.parse(
    fs.readFileSync('./build/contracts/StateChannelModule.json').toString(),
  )
  const dailyLimitModule = JSON.parse(
    fs.readFileSync('./build/contracts/DailyLimitModule.json').toString(),
  )
  const socialRecoveryModule = JSON.parse(
    fs.readFileSync('./build/contracts/SocialRecoveryModule.json').toString(),
  )
  const whitelistModule = JSON.parse(
    fs.readFileSync('./build/contracts/WhitelistModule.json').toString(),
  )
  shell.cd(originalPwd)

  return {
    gnosisSafe: gnosisSafe.networks[50].address,
    proxyFactory: proxyFactory.networks[50].address,
    createAndAddModules: createAndAddModules.networks[50].address,
    multiSend: multiSend.networks[50].address,
    stateChannelModule: stateChannelModule.networks[50].address,
    dailyLimitModule: dailyLimitModule.networks[50].address,
    socialRecoveryModule: socialRecoveryModule.networks[50].address,
    whitelistModule: whitelistModule.networks[50].address,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
