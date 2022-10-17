const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT Unit Tests", function () {
      async function deployContractLockFixture() {
        let basicNft, basicNftContract
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const user = accounts[1]
        await deployments.fixture(["all"])
        basicNftContract = await ethers.getContract("BasicNft")
        basicNft = basicNftContract.connect(deployer)
        return { basicNft, deployer, user }
      }

      describe("Construtor", function () {
        it("Initalizes the NFT correctly", async () => {
          let { basicNft } = await loadFixture(deployContractLockFixture)
          const name = await basicNft.name()
          const symbol = await basicNft.symbol()
          const tokenCounter = await basicNft.getTokenCounter()
          assert.equal(name, "Dogie")
          assert.equal(symbol, "DOG")
          assert.equal(tokenCounter.toString(), "0")
        })
      })

      describe("mintNft", function () {
        async function mintNftLockFixture() {
          let { basicNft, deployer } = await loadFixture(deployContractLockFixture)
          const txResponse = await basicNft.mintNft()
          await txResponse.wait(1)
          return { basicNft, deployer }
        }

        it("allows users to mint an NFT and updates appropriately", async () => {
          const { basicNft } = await loadFixture(mintNftLockFixture)
          const tokenURI = await basicNft.tokenURI(1)
          const tokenCounter = await basicNft.getTokenCounter()
          assert.equal(tokenCounter.toString(), "1")
          assert.equal(tokenURI, await basicNft.TOKEN_URI())
        })
        it("shows the correct balance and owner of an NFT", async () => {
          const { basicNft, deployer } = await loadFixture(mintNftLockFixture)
          const deployerAddress = deployer.address
          const deployerBalance = await basicNft.balanceOf(deployerAddress)
          const owner = await basicNft.ownerOf("1")
          assert.equal(deployerBalance.toString(), "1")
          assert.equal(owner, deployerAddress)
        })
      })
    })
