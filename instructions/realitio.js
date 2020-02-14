const fs = require('fs')
const shell = require('shelljs')

shell.config.fatal = true
shell.config.verbose = true

const name = 'realitio'
const repositoryUrl = 'git@github.com:realitio/realitio-contracts.git'
const commit = 'master'

async function execute() {
  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('npm install')
  shell.cd('truffle')
  shell.exec('../node_modules/.bin/truffle deploy --network development')
  const realitio = JSON.parse(
    fs.readFileSync('./build/contracts/Realitio.json').toString(),
  )
  shell.cd(originalPwd)
  console.log(shell.ls())

  debugger
  return {
    realitio: realitio.networks[50].address,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
