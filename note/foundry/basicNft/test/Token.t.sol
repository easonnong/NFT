// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/Token.sol";

contract TokenTest is Test {
    Token public token;
    address public user1 = vm.addr(1);
    address public user2 = vm.addr(2);

    function setUp() public {
        token = new Token();
    }

    function testTokenURI() public {
        token.ownerMint(user1, 1);
        token.setBaseURI("https://metadata.com/");
        assertEq(token.tokenURI(0), "https://metadata.com/0.json");
    }
}
