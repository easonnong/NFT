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

  const MyLogicV1 = await ethers.getContractFactory("MyLogicV1")
  const myLogicV1 = await upgrades.deployProxy(MyLogicV1, { kind: "uups" })
  await myLogicV1.deployed()
  console.log("MyLogicV1 deployed to:", myLogicV1.address)
  await myLogicV1.SetLogic("aa", 1)
  console.log("GetLogic:", (await myLogicV1.GetLogic("aa")).toString())

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
    await verify(myLogicV1.address, arguments)
  }
}

module.exports.tags = ["all", "myLogic"]
