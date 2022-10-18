const { network, ethers } = require("hardhat")
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  networkConfig,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const FUND_AMOUNT = ethers.utils.parseEther("10")
const imagesLocation = "./images/randomNft/"
let tokenUris = []
const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
}

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris()
  }

  if (chainId == 31337) {
    // create VRFV2 Subscription
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
    const transactionReceipt = await transactionResponse.wait()
    subscriptionId = transactionReceipt.events[0].args.subId
    // Fund the subscription
    // Our mock makes it so we don't actually have to worry about sending fund
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
    subscriptionId = networkConfig[chainId].subscriptionId
  }

  const arguments = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId]["gasLane"],
    networkConfig[chainId]["mintFee"],
    networkConfig[chainId]["callbackGasLimit"],
    tokenUris,
  ]
  const randomIpfsNft = await deploy("RandomIpfsNft", {
    from: deployer,
    args: arguments,
    log: true,
    waitBlockConfirmations: waitBlockConfirmations,
  })

  if (chainId == 31337) {
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address)
  }
}

async function handleTokenUris() {
  tokenUris = []
  const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
  for (imageUploadResponsesIndex in imageUploadResponses) {
    let tokenUrisMetadata = { ...metadataTemplate }
    tokenUrisMetadata.name = files[imageUploadResponsesIndex].replace(".png", "")
    tokenUrisMetadata.description = `An adorable ${tokenUrisMetadata.name} pup!`
    tokenUrisMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponsesIndex].IpfsHash}`
    console.log(`uploading ${tokenUrisMetadata.name}`)
    const metadataUploadResponse = await storeTokenUriMetadata(tokenUrisMetadata)
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
  }
  console.log("token uris uploaded successfully, they are:")
  console.log(tokenUris)
  return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]
