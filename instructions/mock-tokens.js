const fs = require('fs')
const shell = require('shelljs')

shell.config.fatal = true
shell.config.verbose = true

const name = 'mock-tokens'
const repositoryUrl = 'https://github.com/fvictorio/mock-tokens.git'
const commit = 'master'

async function execute() {
  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('yarn')
  shell.exec('./node_modules/.bin/buidler run  --network localhost scripts/deploy.js')
  const addresses = JSON.parse(fs.readFileSync('./addresses.json').toString())
  shell.cd(originalPwd)

  return addresses
}

module.exports = {
  execute,
  dependsOn: [],
}
