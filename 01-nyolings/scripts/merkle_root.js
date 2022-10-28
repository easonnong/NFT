const { MerkleTree } = require("merkletreejs")
const { keccak256 } = require("ethers/lib/utils")

// All whitelisted address
let whitelistedAddress = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
]

const findMerkleRoot = () => {
  let leafNode = whitelistedAddress.map((addr) => keccak256(addr))
  const merkleTree = new MerkleTree(leafNode, keccak256, { sortPairs: true })
  const rootHash = merkleTree.getHexRoot()
  console.log(rootHash, "roothash")
}

// Address you want to find merkle hex proof
let addr = "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"

// Find hex proof
const findHexProof = async () => {
  let indexOfArray = /*await*/ whitelistedAddress.indexOf(addr)
  let leafNode = whitelistedAddress.map((addr) => keccak256(addr))
  const merkleTree = /*await*/ new MerkleTree(leafNode, keccak256, { sortPairs: true })
  const clamingAddress = leafNode[indexOfArray]
  const hexProof = merkleTree.getHexProof(clamingAddress)
  console.log(hexProof, "hexProof")
}

// find merkle root by addr
const findMerkleRootByAddr = (whitelistedAddress) => {
  let leafNode = whitelistedAddress.map((addr) => keccak256(addr))
  const merkleTree = new MerkleTree(leafNode, keccak256, { sortPairs: true })
  const rootHash = merkleTree.getHexRoot()
  console.log(rootHash, "roothash")
}

// Find hex proof by addr
const findHexProofByAddr = async (addr) => {
  let indexOfArray = /*await*/ whitelistedAddress.indexOf(addr)
  let leafNode = whitelistedAddress.map((addr) => keccak256(addr))
  const merkleTree = /*await*/ new MerkleTree(leafNode, keccak256, { sortPairs: true })
  const clamingAddress = leafNode[indexOfArray]
  const hexProof = merkleTree.getHexProof(clamingAddress)
  console.log(hexProof, "hexProof")
}

//findMerkleRoot()
//findHexProof()

module.exports = { findMerkleRoot, findHexProof, findHexProofByAddr, findMerkleRootByAddr }
