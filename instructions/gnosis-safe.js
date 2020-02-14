const fs = require('fs')
const shell = require('shelljs')

shell.config.fatal = true
shell.config.verbose = true

const name = 'gnosis-safe'
const repositoryUrl = 'https://github.com/gnosis/safe-contracts.git'
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
  shell.cd(originalPwd)

  return {
    gnosisSafe: gnosisSafe.networks[50].address,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
