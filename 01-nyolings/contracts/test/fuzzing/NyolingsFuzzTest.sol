// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../../Nyolings.sol";

contract NyolingsFuzzTest is Nyolings {
  constructor() Nyolings() {}

  function echidna_test_allowlist_mint() public view returns (bool) {
    return allowlistMinted[msg.sender] > 0;
  }
}
