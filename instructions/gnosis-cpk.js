const fs = require('fs')
const shell = require('shelljs')

shell.config.fatal = true
shell.config.verbose = true

const name = 'gnosis-cpk'
const repositoryUrl =
  'https://github.com/gnosis/contract-proxy-kit.git'
const commit = 'master'

async function execute() {
  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('npm install')
  shell.exec('./node_modules/.bin/truffle deploy --network development')
  const gnosisSafe = JSON.parse(
    fs.readFileSync('./build/contracts/GnosisSafe.json').toString(),
  )
  const cpkFactory = JSON.parse(
    fs.readFileSync('./build/contracts/CPKFactory.json').toString(),
  )
  const multiSend = JSON.parse(
    fs.readFileSync('./build/contracts/MultiSend.json').toString(),
  )
  const defaultCallbackHandler = JSON.parse(
    fs.readFileSync('./build/contracts/DefaultCallbackHandler.json').toString(),
  )
  shell.cd(originalPwd)

  return {
    gnosisSafe: gnosisSafe.networks[50].address,
    cpkFactory: cpkFactory.networks[50].address,
    multiSend: multiSend.networks[50].address,
    defaultCallbackHandler: defaultCallbackHandler.networks[50].address,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
