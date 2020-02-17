#!/usr/bin/env node

const fs = require('fs')
const tsort = require('tsort')

const configFile = process.argv[2]

if (!configFile) {
  console.log('usage: gsc config.json')
}

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
  }

  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(accumulatedOutput, null, 2))
  }
}

main(config).catch(e => {
  console.error(e)
  process.exit(1)
})
