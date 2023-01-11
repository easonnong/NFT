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

    function testAllowlistMint() public {
        vm.prank(user1);
        vm.expectRevert(InvalidSaleState.selector);
        // console.logBytes4(InvalidSaleState.selector);
        token.allowlistMint();

        // Open up allowlist claim
        token.setSaleState(1);

        vm.prank(user1);
        vm.expectRevert(NotOnAllowlist.selector);
        token.allowlistMint();

        // Add to allowlist
        address[] memory addresses = new address[](1);
        addresses[0] = user1;
        token.setAllowlist(addresses);

        vm.prank(user1);
        token.allowlistMint();
        assertEq(token.balanceOf(user1), 1);
        assertEq(token.ownerOf(0), user1);

        // Verify allowlist can't be used twice
        vm.prank(user1);
        vm.expectRevert(NotOnAllowlist.selector);
        token.allowlistMint();
    }

    function testPublicMint() public {
        vm.prank(user1);
        vm.expectRevert(InvalidSaleState.selector);
        token.publicMint(3);

        // Open public mint
        token.setSaleState(2);

        vm.prank(user1);
        token.publicMint(3);
        assertEq(token.balanceOf(user1), 3);
        for (uint256 i = 0; i < 3; i++) {
            assertEq(token.ownerOf(i), user1);
        }

        vm.prank(user1);
        vm.expectRevert(InvalidQuantity.selector);
        token.publicMint(4);

        token.ownerMint(user1, 97);
        vm.prank(user1);
        vm.expectRevert(MaxSupplyReached.selector);
        token.publicMint(1);
    }

    function testOwnerMint() public {
        token.ownerMint(user1, 100);
        assertEq(token.balanceOf(user1), 100);
        for (uint256 i = 0; i < 100; ++i) {
            assertEq(token.ownerOf(i), user1);
        }

        vm.expectRevert(MaxSupplyReached.selector);
        token.ownerMint(user1, 1);
    }

    function testSetAllowlist() public {
        address[] memory addresses = new address[](100);
        for (uint256 i = 1; i <= 100; ++i) {
            addresses[i - 1] = vm.addr(i);
        }
        token.setAllowlist(addresses);

        for (uint256 i = 1; i <= 100; ++i) {
            assertTrue(token.isOnAllowlist(vm.addr(i)));
        }
    }

    function testSupportsInterface() public view {}

    function testTokenURI() public {
        token.ownerMint(user1, 1);
        token.setBaseURI("https://metadata.com/");
        assertEq(token.tokenURI(0), "https://metadata.com/0.json");
    }
}
