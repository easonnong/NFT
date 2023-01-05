// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// 0xad35C39a480edFE3878313BB90f9d92dD2106003
// 0xCF5d40DBF972e226222EA4ff4f87f53e7f7D0029

contract Potatoz is ERC721Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
  function initialize() public initializer {
    __ERC721_init("Potatoz", "POTATOZ");
    __Ownable_init();
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
