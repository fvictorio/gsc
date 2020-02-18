const fs = require('fs')
const shell = require('shelljs')
const ethers = require('ethers')

const { createEthersInstance, readJson } = require('../utils')

shell.config.fatal = true
shell.config.verbose = true

const name = 'mock-tokens'
const repositoryUrl = 'https://github.com/fvictorio/mock-tokens.git'

async function execute(config) {
  const commit = config.commit || 'master'

  const originalPwd = shell.pwd()
  if (!fs.existsSync(name)) {
    shell.exec(`git clone "${repositoryUrl}" "${name}"`)
  }
  shell.cd(name)
  shell.exec(`git checkout "${commit}"`)
  shell.exec('yarn')
  shell.exec('./node_modules/.bin/truffle migrate --network development')

  const ERC20FactoryArtifact = readJson('./build/contracts/ERC20Factory.json')
  const IERC20Artifact = readJson('./build/contracts/IERC20.json')

  const ERC20Factory = createEthersInstance(ERC20FactoryArtifact)
  const signer = new ethers.providers.JsonRpcProvider(
    'http://localhost:8545',
  ).getSigner()

  const tokens = config.tokens || []
  const tokensInstances = {}
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const totalSupply = token.totalSupply || '100000000000000000000'
    const name = token.name || `Mock Token ${i + 1}`
    const symbol = token.symbol || `MOCK${i + 1}`
    const decimals = token.decimals || 18
    const args = [totalSupply, name, symbol, decimals]
    const tokenAddress = await ERC20Factory.callStatic.create(...args)
    await ERC20Factory.create(...args)

    tokensInstances[symbol] = new ethers.Contract(
      tokenAddress,
      IERC20Artifact.abi,
      signer,
    )
  }

  shell.cd(originalPwd)

  return {
    ERC20Factory,
    ...tokensInstances,
  }
}

module.exports = {
  execute,
  dependsOn: [],
}
