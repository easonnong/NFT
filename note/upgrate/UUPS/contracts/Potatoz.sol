// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract Potatoz is ERC721Upgradeable {
    function initialize() public initializer {
        +__ERC721_init("Potatoz", "POTATOZ");
    }
}
