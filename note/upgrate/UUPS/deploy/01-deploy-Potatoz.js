const { network, ethers, upgrades } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  const arguments = []
  // const potatoz = await deploy("Potatoz", {
  //   from: deployer,
  //   args: arguments,
  //   log: true,
  //   waitBlockConfirmations: waitBlockConfirmations,
  // })
  const Potatoz = await ethers.getContractFactory("Potatoz")

  const potatoz = await upgrades.deployProxy(Potatoz)

  await potatoz.deployed()

  console.log("Potatoz deployed to:", potatoz.address)

  // Verify the deployment
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(potatoz.address, arguments)
  }
}

module.exports.tags = ["all", "potatoz"]
