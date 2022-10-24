const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Nyolings NFT Unit Tests", function () {
      async function deployContractLockFixture() {
        let noylings, noylingsContract
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const user = accounts[1]
        await deployments.fixture(["nyolings"])
        noylingsContract = await ethers.getContract("Nyolings")
        noylings = noylingsContract.connect(deployer)
        return { noylings, deployer, user }
      }

      describe("construtor", function () {
        it("initalizes the NFT correctly", async () => {
          let { noylings } = await loadFixture(deployContractLockFixture)
          const name = await noylings.name()
          const symbol = await noylings.symbol()
          assert.equal(name, "Nyolings")
          assert.equal(symbol, "NYOLINGS")
        })
      })
    })
