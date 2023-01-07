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

  /*
  const BoxV1 = await ethers.getContractFactory("BoxV1")
  const boxV1 = await upgrades.deployProxy(BoxV1, [3], { initializer: "initialize" })
  await boxV1.deployed()
  console.log("BoxV1 deployed to:", boxV1.address)
  console.log("BoxV1 val:", (await boxV1.val()).toString())
  await boxV1.inc()
  await boxV1.inc()
  console.log("BoxV1 val after inc:", (await boxV1.val()).toString())
  */

  const BoxV2 = await ethers.getContractFactory("BoxV2")
  const boxV2 = await upgrades.upgradeProxy("0xad95143dA689E38F857ea75c70de87bf0383Ba8d", BoxV2)
  await boxV2.deployed()
  console.log("BoxV2 deployed to:", boxV2.address)
  console.log("BoxV2 val:", (await boxV2.val()).toString())
  await boxV2.inc()
  await boxV2.inc()
  console.log("BoxV2 val after inc:", (await boxV2.val()).toString())

  // Verify the deployment
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(boxV2.address, arguments)
  }
}

module.exports.tags = ["all", "box"]
