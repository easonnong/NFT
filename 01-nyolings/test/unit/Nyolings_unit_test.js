const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Nyolings NFT Unit Tests", function () {
      async function deployContractLockFixture() {
        let nyolings, noylingsContract
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const user = accounts[1]
        await deployments.fixture(["nyolings"])
        noylingsContract = await ethers.getContract("Nyolings")
        nyolings = noylingsContract.connect(deployer)
        return { nyolings, deployer, user }
      }

      describe("construtor", function () {
        it("initalizes the NFT correctly", async () => {
          let { nyolings } = await loadFixture(deployContractLockFixture)
          expect((await nyolings.name()).toString()).to.equal("Nyolings")
          expect((await nyolings.symbol()).toString()).to.equal("NYOLINGS")
          expect((await nyolings.state()).toString()).to.equal("0")
          expect((await nyolings.maxSupply()).toString()).to.equal("7777")
          expect((await nyolings.publicSupply()).toString()).to.equal("5555")
          expect(ethers.utils.formatEther(await nyolings.publicCost())).to.equal("0.03")
          expect((await nyolings.maxMintAmountPerTx()).toString()).to.equal("3")
          expect((await nyolings.maxPerWalletPublic()).toString()).to.equal("3")
          expect((await nyolings.maxPerWalletAllowlist()).toString()).to.equal("3")
          expect((await nyolings.uriPrefix()).toString()).to.equal("")
          expect((await nyolings.hiddenMetadataUri()).toString()).to.equal("ipfs://")
        })
      })

      describe("publicMint", function () {
        it("reverts if public mint is disabled")
      })
    })
