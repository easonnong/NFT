const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Random Ipfs NFT Unit Tests", function () {
      async function deployContractLockFixture() {
        let randomIpfsNft, randomIpfsNftContract, vrfCoordinatorV2Mock, vrfCoordinatorV2MockContract
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const user = accounts[1]
        await deployments.fixture(["mocks", "randomipfs"])
        randomIpfsNftContract = await ethers.getContract("RandomIpfsNft")
        randomIpfsNft = randomIpfsNftContract.connect(deployer)
        vrfCoordinatorV2MockContract = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Mock = vrfCoordinatorV2MockContract.connect(deployer)
        return { randomIpfsNft, deployer, user }
      }

      describe("Construtor", function () {
        it("sets starting values correctly", async () => {
          let { randomIpfsNft } = await loadFixture(deployContractLockFixture)
          const dogTokenUriZero = await randomIpfsNft.getDogTokenUris(0)
          const isInitialized = await randomIpfsNft.getInitialized()
          assert(dogTokenUriZero.includes("ipfs://"))
          assert.equal(isInitialized, true)
        })
      })

      describe("requestNft", function () {
        it("fails if payment isn't sent with the request", async () => {
          let { randomIpfsNft } = await loadFixture(deployContractLockFixture)
          await expect(randomIpfsNft.requestNft()).to.be.revertedWithCustomError(
            randomIpfsNft,
            "RandomIpfsNft__NeedMoreETHSent"
          )
        })
        it("reverts if payment amount is less than the mint fee", async () => {
          let { randomIpfsNft } = await loadFixture(deployContractLockFixture)
          const fee = await randomIpfsNft.getMintFee()
          await expect(
            randomIpfsNft.requestNft({ value: fee.sub(ethers.utils.parseEther("0.001")) })
          ).to.be.revertedWithCustomError(randomIpfsNft, "RandomIpfsNft__NeedMoreETHSent")
        })
        it("emits an event and kicks off a random word request", async () => {
          let { randomIpfsNft } = await loadFixture(deployContractLockFixture)
          const fee = await randomIpfsNft.getMintFee()
          await expect(randomIpfsNft.requestNft({ value: fee.toString() })).to.emit(
            randomIpfsNft,
            "NftRequested"
          )
        })
      })

      describe.only("fulfillRandomWords", function () {
        it("mint NFT after random number is returned", async () => {
          let { randomIpfsNft } = await loadFixture(deployContractLockFixture)
          await new Promise(async (resolve, reject) => {
            randomIpfsNft.once("NftMinted", async () => {
              try {
                const tokenUri = await randomIpfsNft.tokenURI("0")
                const tokenCounter = await randomIpfsNft.getTokenCounter()
                assert.equal(tokenUri.toString().includes("ipfs://"), true)
                assert.equal(tokenCounter.toString(), "1")
                resolve()
              } catch (error) {
                console.log(error)
                reject(error)
              }
            })
            try {
              const fee = await randomIpfsNft.getMintFee()
              const requestNftResponse = await randomIpfsNft.requestNft({ value: fee.toString() })
              const requestNftReceipt = await requestNftResponse.wait(1)
              await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestNftReceipt.events[1].args.requestId,
                randomIpfsNft.address
              )
            } catch (error) {
              console.log(error)
              reject(error)
            }
          })
        })
      })
    })
