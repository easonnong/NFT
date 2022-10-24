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

module.exports = { findMerkleRoot }
