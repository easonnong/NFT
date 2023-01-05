const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { CustomError } = require("hardhat/internal/hardhat-network/stack-traces/model")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Potatoz Unit Tests", function () {
      async function deployContractLockFixture() {
        let potatoz, potatozContract
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const user = accounts[1]
        await deployments.fixture(["all"])
        potatozContract = await ethers.getContract("Potatoz")
        potatoz = potatozContract.connect(deployer)
        return { potatoz, potatozContract, deployer, user }
      }

      describe("listItem", function () {
        it("exclusively items that haven't been listed", async () => {
          let { potatoz } = await loadFixture(deployContractLockFixture)
          console.log("Potatoz deployed to:", potatoz.address)
        })
      })
    })
