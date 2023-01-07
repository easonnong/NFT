// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Potatoz.sol";

contract PotatozV3 is Potatoz {
  // Token name
  string private v2;
  string private v3;

  function version() public view returns (string memory) {
    return "v3";
  }
}
