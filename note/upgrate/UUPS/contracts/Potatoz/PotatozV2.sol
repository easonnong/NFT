// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Potatoz.sol";

contract PotatozV2 is Potatoz {
  // Token name
  string private v2;

  function version() public view returns (string memory) {
    return "v2";
  }
}
