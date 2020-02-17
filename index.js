#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const tsort = require('tsort')

if (!process.argv[2]) {
  console.log('usage: gsc config.json')
}

const configFile = path.resolve(process.argv[2])

const outputFile = process.argv[3]

const config = JSON.parse(fs.readFileSync(configFile).toString())

async function main(config) {
  const graph = tsort()

  for (const project of Object.keys(config.projects)) {
    const { dependsOn } = require(`./instructions/${project}`)
    if (dependsOn.length) {
      dependsOn.forEach(dependency => graph.add(dependency, project))
    } else {
      graph.add(project)
    }
  }

  const sortedProjects = graph.sort()

  let accumulatedOutput = {}

  for (const project of sortedProjects) {
    const { execute } = require(`./instructions/${project}`)
    const output = await execute(config.projects[project], accumulatedOutput)

    accumulatedOutput = {
      ...accumulatedOutput,
      [project]: output,
    }

    if (config.projects[project].postdeploy) {
      const postdeployPath = path.resolve(
        path.dirname(configFile),
        config.projects[project].postdeploy,
      )
      const postdeploy = require(postdeployPath)
      const newEnv = await postdeploy(accumulatedOutput)
      accumulatedOutput = newEnv || accumulatedOutput
    }
  }

  if (outputFile) {
    const addresses = {}
    for (const [project, contracts] of Object.entries(accumulatedOutput)) {
      addresses[project] = {}
      for (const [contractName, contract] of Object.entries(contracts)) {
        addresses[project][contractName] = contract.address
      }
    }
    fs.writeFileSync(outputFile, JSON.stringify(addresses, null, 2))
  }
}

main(config).catch(e => {
  console.error(e)
  process.exit(1)
})
