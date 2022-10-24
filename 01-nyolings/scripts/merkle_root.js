const { MerkleTree } = require("merkletreejs")
const { keccak256 } = require("ethers/lib/utils")

// All whitelisted address
let whitelistedAddress = ["0x...", "0x..."]

const findMerkleRoot = () => {
  let leafNode = whitelistedAddress.map((addr) => keccak256(addr))
  const merkleTree = new MerkleTree(leafNode, keccak256, { sortPairs: true })
  const rootHash = merkleTree.getHexRoot()
  console.log(rootHash, "roothash")
}

// Address you want to find merkle hex proof
let addr = "0x..."

// Find hex proof
const findHexProof = async () => {
  let indexOfArray = /*await*/ whitelistedAddress.indexOf(addr)
  let leafNode = whitelistedAddress.map((addr) => keccak256(addr))
  const merkleTree = /*await*/ new MerkleTree(leafNode, keccak256, { sortPairs: true })
  const clamingAddress = leafNode[indexOfArray]
  const hexProof = merkleTree.getHexProof(clamingAddress)
  console.log(hexProof, "hexProof")
}

module.exports = { findMerkleRoot, findHexProof }
