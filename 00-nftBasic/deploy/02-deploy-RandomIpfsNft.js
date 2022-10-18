const { network, ethers } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const FUND_AMOUNT = ethers.utils.parseEther("10")
const imagesLocation = "./images/randomNft/"

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  const arguments = []
  const basicNft = await deploy("BasicNft", {
    from: deployer,
    args: arguments,
    log: true,
    waitBlockConfirmations: waitBlockConfirmations,
  })
}

module.exports.tags = ["all", "basicNft"]
