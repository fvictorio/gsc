const fs = require('fs')
const shell = require('shelljs')

shell.config.fatal = true
shell.config.verbose = true

const name = 'realitio-gnosis-proxy'
const repositoryUrl = 'https://github.com/fvictorio/realitio-gnosis-proxy.git'
const commit = 'master'

async function execute(input) {
  console.log(input)
  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('yarn')

  shell.env.CONDITIONAL_TOKENS_ADDRESS =
    input['conditional-tokens'].conditionalTokens
  shell.env.REALITIO_ADDRESS = input.realitio.realitio

  shell.exec('./node_modules/.bin/truffle deploy --network development')
  const realitioGnosisProxy = JSON.parse(
    fs.readFileSync('./build/contracts/RealitioProxy.json').toString(),
  )
  shell.cd(originalPwd)
  console.log(shell.ls())

  return {
    realitioGnosisProxy: realitioGnosisProxy.networks[50].address,
  }
}

module.exports = {
  execute,
  dependsOn: ['conditional-tokens', 'realitio'],
}
