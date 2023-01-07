// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract BoxV1 {
  uint256 public val;

  function initialize(uint256 _val) external {
    val = _val;
  }

  function inc() external {
    val++;
  }
}

contract BoxV2 {
  uint256 public val;

  function inc() external {
    val++;
  }

  function dec() external {
    val--;
  }
}
