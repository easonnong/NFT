const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { CustomError } = require("hardhat/internal/hardhat-network/stack-traces/model")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("MyLogic Unit Tests", function () {
      async function deployContractLockFixture() {
        let myLogic, myLogicContract
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const user = accounts[1]
        await deployments.fixture(["all"])
        myLogicContract = await ethers.getContract("MyLogic")
        myLogic = myLogicContract.connect(deployer)
        return { myLogic, myLogicContract, deployer, user }
      }

      describe("listItem", function () {
        it("exclusively items that haven't been listed", async () => {
          let { myLogic } = await loadFixture(deployContractLockFixture)
          console.log("MyLogic deployed to:", myLogic.address)
        })
      })
    })
