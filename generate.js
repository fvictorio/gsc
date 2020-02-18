#!/usr/bin/env node

const fs = require('fs')
const inquirer = require('inquirer')

const gscVersion = require('./package.json').version

const questions = [
  {
    name: 'projects',
    type: 'checkbox',
    message: 'Choose the projects you want to use',
    choices: [
      {
        name: 'Gnosis Conditional Tokens',
        value: 'conditional-tokens',
      },
      {
        name: 'Gnosis Contract Proxy Kit',
        value: 'gnosis-cpk',
      },
      {
        name: 'Gnosis Dex',
        value: 'gnosis-dex',
      },
      {
        name: 'Gnosis Safe',
        value: 'gnosis-safe',
      },
      {
        name: 'Realitio',
        value: 'realitio',
      },
    ],
    validate: input => {
      if (!input || !input.length) {
        return 'You must select at least one project'
      }
      return true
    },
  },
  {
    name: 'tokens',
    type: 'number',
    message: 'Choose how many mock tokens you want to add',
    default: 0,
  },
]

const dockerfile = `
FROM node:10

RUN apt update && apt install -y python-pip

WORKDIR ganache
ENV PATH="./node_modules/.bin:\${PATH}"
RUN npm install ganache-cli@6.8.2
RUN npm install @fvictorio/gsc@${gscVersion}

COPY . .
RUN bash prepare_db.sh

EXPOSE 8545

CMD ["./node_modules/.bin/ganache-cli", "-d", "--db", "db", "-h", "0.0.0.0", "-i", "50", "-l", "10000000"]
`.trim()

const prepareDb = `
set -e # exit when any command fails

mkdir db
ganache-cli -d --db db -i 50 -l 10000000 &
PID=$!

gsc-run config.json addresses.json

# stop ganache
kill $PID
`.trim()

inquirer.prompt(questions).then(answers => {
  const { projects, tokens } = answers

  const config = {
    projects: {},
  }
  projects.forEach(project => {
    config.projects[project] = {}
  })
  if (tokens > 0) {
    config.projects['mock-tokens'] = {
      tokens: [...Array(tokens)].map(() => ({})),
    }
  }

  fs.writeFileSync('Dockerfile', dockerfile)
  fs.writeFileSync('prepare_db.sh', prepareDb)
  fs.writeFileSync('config.json', JSON.stringify(config, null, 2))
})
