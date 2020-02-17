const fs = require('fs')
const ethers = require('ethers')

const signer = new ethers.providers.JsonRpcProvider(
  'http://localhost:8545',
).getSigner()

const createEthersInstance = artifact => {
  const { abi, networks } = artifact
  const { address } = networks[50]

  return new ethers.Contract(address, abi, signer)
}

const readJson = jsonPath => {
  return JSON.parse(fs.readFileSync(jsonPath).toString())
}

module.exports = {
  createEthersInstance,
  readJson,
}
