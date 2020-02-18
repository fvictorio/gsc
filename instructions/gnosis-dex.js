const fs = require('fs')
const shell = require('shelljs')
const ethers = require('ethers')

const { createEthersInstance, readJson } = require('../utils')

shell.config.fatal = true
shell.config.verbose = true

const name = 'gnosis-dex'
const repositoryUrl = 'https://github.com/gnosis/dex-contracts.git'

async function execute(config) {
  const commit = config.commit || 'master'

  const signer = new ethers.providers.JsonRpcProvider(
    'http://localhost:8545',
  ).getSigner()
  const address = await signer.getAddress()

  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('yarn')
  shell.exec('./node_modules/.bin/truffle migrate --network development')

  const BatchExchangeArtifact = readJson('./build/contracts/BatchExchange.json')
  const TokenOWLArtifact = readJson('./build/contracts/TokenOWL.json')
  const TokenOWLProxyArtifact = readJson('./build/contracts/TokenOWLProxy.json')

  const BatchExchange = createEthersInstance(BatchExchangeArtifact)
  const TokenOWL = createEthersInstance(TokenOWLArtifact)
  const TokenOWLProxy = createEthersInstance(TokenOWLProxyArtifact)

  const OWL = new ethers.Contract(
    TokenOWLProxy.address,
    TokenOWL.interface,
    signer,
  )

  await OWL.setMinter(address)
  await OWL.mintOWL(address, '1000000000000000000000')

  shell.cd(originalPwd)

  return {
    BatchExchange,
    TokenOWL,
    TokenOWLProxy,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
