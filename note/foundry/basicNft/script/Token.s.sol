// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721Metadata.sol";
import "erc721a/contracts/interfaces/IERC721A.sol";

contract TokenScript is Script {
    function setUp() public {}

    function getSelector() public view {
        bytes4 _IERC165InterfaceId = type(IERC165).interfaceId;
        console.log("_IERC165InterfaceId:");
        console.logBytes4(_IERC165InterfaceId);
        bytes4 _IERC2581InterfaceId = type(IERC2981).interfaceId;
        console.log("IERC2581InterfaceId:");
        console.logBytes4(_IERC2581InterfaceId);
        bytes4 _IERC721InterfaceId = type(IERC721).interfaceId;
        console.log("IERC721InterfaceId:");
        console.logBytes4(_IERC721InterfaceId);
        bytes4 _IERC721MetadataInterfaceId = type(IERC721Metadata).interfaceId;
        console.log("IERC721MetadataInterfaceId:");
        console.logBytes4(_IERC721MetadataInterfaceId);
    }

    function run() public {
        // vm.broadcast();
        vm.startBroadcast();
        getSelector();
        vm.stopBroadcast();
    }
}
