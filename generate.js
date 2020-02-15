#!/usr/bin/env node

const fs = require('fs')
const inquirer = require('inquirer')

const questions = [
  {
    name: 'projects',
    type: 'checkbox',
    message: 'Choose the projects you want to use',
    default: [],
    choices: [
      {
        name: 'Realitio',
        value: 'realitio',
      },
      {
        name: 'Gnosis Conditional Tokens',
        value: 'conditional-tokens',
      }
    ],
  },
]

const dockerfile = `
FROM node:10

WORKDIR ganache
ENV PATH="./node_modules/.bin:\${PATH}"
RUN npm install ganache-cli@6.8.2
RUN npm install @fvictorio/gsc

COPY config.json prepare_db.sh ./
RUN bash prepare_db.sh

EXPOSE 8545

CMD ["./node_modules/.bin/ganache-cli", "-d", "--db", "db", "-h", "0.0.0.0", "-i", "50"]
`.trim()

const prepareDb = `
set -e # exit when any command fails

mkdir db
ganache-cli -d --db db -i 50 &
PID=$!

gsc-run config.json > addresses.json

# stop ganache
kill $PID
`.trim()

inquirer.prompt(questions).then(answers => {
  const { projects } = answers

  const config = {
    projects: projects.map(project => ({ name: project })),
  }

  fs.writeFileSync('Dockerfile', dockerfile)
  fs.writeFileSync('prepare_db.sh', prepareDb)
  fs.writeFileSync('config.json', JSON.stringify(config, null, 2))
})
