const fs = require('fs')
const shell = require('shelljs')

shell.config.fatal = true
shell.config.verbose = true

const name = 'conditional-tokens'
const repositoryUrl = 'git@github.com:gnosis/conditional-tokens-contracts.git'
const commit = 'master'

async function execute() {
  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('npm install')
  shell.exec('./node_modules/.bin/truffle deploy --network local')
  const conditionalTokens = JSON.parse(
    fs.readFileSync('./build/contracts/ConditionalTokens.json').toString(),
  )
  shell.cd(originalPwd)
  console.log(shell.ls())

  debugger
  return {
    conditionalTokens: conditionalTokens.networks[50].address,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
