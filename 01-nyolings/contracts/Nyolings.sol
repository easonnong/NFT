// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC721A.sol";

contract Nyolings is ERC721A, Ownable, ReentrancyGuard {
  using Strings for uint256;

  uint256 maxSupply = 7777;
  uint256 maxMintAmountPerTx = 3;

  constructor() ERC721A("Nyolings", "NYOLINGS") {}

  // OVERRIDES
  //function _startTokenId()

  //function _baseURI()

  // MODIFIERS
  modifier mintCompliance(uint256 amount) {
    require(amount > 0 && amount <= maxMintAmountPerTx, "Invalid mint amount");
    require(totalSupply() + amount <= maxSupply, "Max supply exceeded");
    _;
  }

  // MERKLE TREE
  //function _verify

  //function _leaf

  // MINTING FUNCTIONS
  function publicMint(uint256 amount) external payable mintCompliance(amount) {}

  //function mintAllowList

  //function refund()

  //function mintForAddress

  // GETTERS
  //function getRefundAmount

  //function numberMinted

  //function tokenURI

  //function walletOfOwner

  // SETTERS
  //function setState

  //function setCosts

  //function setPublicSupply

  //function setMaxSupply

  //function setMaxMintAmountPerTx

  //function setMaxPerWalletPublic

  //function setHiddenMetadataUri

  //function setUriPrefix

  //function setWhitelistMerkleRoot

  // WITHDRAW
  //function withdraw()
}
