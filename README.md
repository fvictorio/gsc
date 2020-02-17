# Ganache Sandbox Creator

Create a docker image of a ganache instance with all your required projects already deployed.

## The problem

If you are building a dapp that interacts with other ethereum projects, you have a couple of options:

- Use the mainnet (expensive and slow)
- Use a testnet (still kind of slow, plus not all projects are deployed in the same testnets)
- Manually deploy each project in a ganache instance

The last option is cheap and flexible, but the setup takes a lot of time. Plus, resetting ganache to a clean slate, while [possible](https://github.com/trufflesuite/ganache-cli#custom-methods), is not straightforward. Finally, you can't commit this to your repo or share it in a "Infrastructure as code" way.

All these problems can be fixed if you create a docker image with a ganache instance that already has the state you want. This way, you can easily share it, stop it and restart it. The state is not lost between reboots. And you can leverage all the docker machinery to do whatever you want (you can `docker commit`, you can use this image as a base image for other stuff, you can include it in a docker-compose setup). But it's not clear how to build this image.

## This solution

This project lets you do all of that in a very easy way.

First, you run `npx @fvictorio/gsc` in an empty directory and choose the projects you want to include. This will create a `Dockerfile` and some other files. You can then do `docker build -t my-sandbox .` and then you can run it with `docker run -it -p 8545:8545 my-sandbox`. And that's it! You have a working ganache instance with the selected projects. You can also do `docker run -it my-sandbox cat addresses.json` to see the addresses of all the relevant contracts for each project.

## Supported projects

The supported project right now are:

- [Gnosis Conditional Tokens](https://github.com/gnosis/conditional-tokens-contracts)
- [Gnosis Contract Proxy Kit](https://github.com/gnosis/contract-proxy-kit)
- [Gnosis Safe](https://github.com/gnosis/safe-contracts)
- [Realitio](https://github.com/realitio/realitio-contracts)

If you want some other one to be included, just [open an issue](https://github.com/fvictorio/gsc/issues/new).
