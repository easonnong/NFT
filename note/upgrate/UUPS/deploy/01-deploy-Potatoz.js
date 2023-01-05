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
  const potatoz = await upgrades.deployProxy(Potatoz, { kind: "uups" })
  await potatoz.deployed()

  console.log("Potatoz deployed to:", potatoz.address)
  console.log("Potatoz name:", await potatoz.name())
  console.log("Potatoz version:", await potatoz._exists(1))

  const PotatozV2 = await ethers.getContractFactory("PotatozV2")
  const potatozV2 = await upgrades.upgradeProxy(potatoz, PotatozV2)
  await potatozV2.deployed()

  console.log("PotatozV2 deployed to:", potatozV2.address)
  console.log("PotatozV2 name:", await potatozV2.name())
  console.log("PotatozV2 version:", await potatozV2.version())
  console.log("PotatozV2 version:", await potatozV2._exists(1))

  const PotatozV3 = await ethers.getContractFactory("PotatozV3")
  const potatozV3 = await upgrades.upgradeProxy(potatoz, PotatozV3)
  await potatozV3.deployed()

  console.log("PotatozV3 deployed to:", potatozV3.address)
  console.log("PotatozV3 name:", await potatozV3.name())
  console.log("PotatozV3 version:", await potatozV3.version())

  // Verify the deployment
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(potatoz.address, arguments)
  }
}

module.exports.tags = ["all", "potatoz"]
