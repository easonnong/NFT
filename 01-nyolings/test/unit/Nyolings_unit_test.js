const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const {
  findMerkleRoot,
  findHexProof,
  findHexProofByAddr,
  findMerkleRootByAddr,
} = require("../../scripts/merkle_root")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Nyolings NFT Unit Tests", function () {
      async function deployContractLockFixture() {
        let nyolings, noylingsContract
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const user1 = accounts[1]
        const user2 = accounts[2]
        const user3 = accounts[3]
        await deployments.fixture(["nyolings"])
        noylingsContract = await ethers.getContract("Nyolings")
        nyolings = noylingsContract.connect(deployer)
        return { nyolings, deployer, user1, user2, user3 }
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
        it("reverts if public mint is disabled", async () => {
          let { nyolings } = await loadFixture(deployContractLockFixture)
          await expect(nyolings.publicMint(1)).to.be.revertedWith("Public mint is disabled")
        })
        describe("mintCompliance", function () {
          it("reverts if mint more than maxMintAmountPerTx", async () => {
            let { nyolings } = await loadFixture(deployContractLockFixture)
            await nyolings.setState(1)
            await expect(nyolings.publicMint(4)).to.be.revertedWith("Invalid mint amount")
          })
          it("reverts if mint more than maxSupply", async () => {
            let { nyolings, deployer } = await loadFixture(deployContractLockFixture)
            await nyolings.setState(1)
            await nyolings.mintForAddress(deployer.address, 7775)
            await expect(nyolings.publicMint(3)).to.be.revertedWith("Max supply exceeded")
          })
        })
        it("reverts if public mint minted more than limit", async () => {
          let { nyolings } = await loadFixture(deployContractLockFixture)
          await nyolings.setState(1)
          const fee = ethers.utils.parseEther((0.03 * 3).toString())
          await nyolings.publicMint(3, { value: fee.toString() })
          await expect(nyolings.publicMint(1)).to.be.revertedWith("Cannot mint that many")
        })
        it("reverts if public donnot have enough eth", async () => {
          let { nyolings } = await loadFixture(deployContractLockFixture)
          await nyolings.setState(1)
          const fee = ethers.utils.parseEther((0.01).toString())
          await expect(nyolings.publicMint(1)).to.be.revertedWith("Need more eth")
        })
        it("updates the price of the item and emits ItemListed", async () => {
          let { nyolings, deployer } = await loadFixture(deployContractLockFixture)
          await nyolings.setState(1)
          const fee = ethers.utils.parseEther("0.03")
          await nyolings.publicMint(1, { value: fee.toString() })
          expect(ethers.utils.formatEther(await nyolings.publicPaid(deployer.address))).to.equal(
            "0.03"
          )
          expect(await nyolings.publicMinted(deployer.address)).to.equal(1)
          expect(await nyolings.balanceOf(deployer.address)).to.equal(1)
        })
      })

      describe("allowlistMint", function () {
        it.only("reverts if allowlist mint is disabled", async () => {
          let { nyolings, deployer, user1, user2, user3 } = await loadFixture(
            deployContractLockFixture
          )
          const addrs = [
            deployer.address.toString(),
            user1.address.toString(),
            user2.address.toString(),
            user3.address.toString(),
          ]
          const root = findMerkleRootByAddr(addrs)
          const proof = await findHexProofByAddr(addrs, user1.address.toString())
          await nyolings.setWhitelistMerkleRoot(root)
          await expect(nyolings.allowlistMint(1)).to.be.revertedWith("Allow list mint is disabled")
        })
        it("reverts if allowlist mint cannot verify", async () => {
          let { nyolings } = await loadFixture(deployContractLockFixture)
          await expect(nyolings.allowlistMint(1)).to.be.revertedWith("Allow list mint is disabled")
          findMerkleRoot()
          findHexProofByAddr("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
        })
      })
    })
