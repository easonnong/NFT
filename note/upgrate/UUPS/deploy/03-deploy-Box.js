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

  const BoxV1 = await ethers.getContractFactory("BoxV1")
  const boxV1 = await upgrades.deployProxy(BoxV1, [3], { initializer: "initialize" })
  await boxV1.deployed()
  console.log("BoxV1 deployed to:", boxV1.address)
  console.log("BoxV1 val:", boxV1.val())

  /*
  const MyLogicV2 = await ethers.getContractFactory("MyLogicV2")
  const myLogicV2 = await upgrades.upgradeProxy(myLogic, MyLogicV2)
  await myLogicV2.deployed()
  */

  /*
  const MyLogicV3 = await ethers.getContractFactory("MyLogicV3")
  const myLogicV3 = await upgrades.upgradeProxy(myLogic, MyLogicV3)
  await myLogicV3.deployed()

  console.log("MyLogicV3 deployed to:", myLogicV3.address)
  console.log("MyLogicV3 name:", await myLogicV3.name())
  console.log("MyLogicV3 version:", await myLogicV3.version())
*/
  // Verify the deployment
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(boxV1.address, arguments)
  }
}

module.exports.tags = ["all", "myLogic"]
