// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OperatorFilterer} from "closedsea/src/OperatorFilterer.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {ERC721A} from "erc721a/contracts/ERC721A.sol";

contract Token is Ownable, OperatorFilterer, ERC2981, ERC721A {
    enum SaleStates {
        CLOSED,
        ALLOWLIST,
        PUBLIC
    }

    uint256 public constant MAX_SUPPLY = 100;
    uint256 public constant MAX_PER_MINT = 3;

    SaleStates public SaleState;
    address public royaltyReceiver;
    bool public operatorFilteringEnabled = true;
    string public _baseTokenURI = "";

    constructor() ERC721A("Token", "TOKEN") {
        _registerForOperatorFiltering();
        // Set initial 5% royalty
        // _setDefaultRoyalty(royaltyReceiver, 500);
    }

    // =============================================================
    //                     OPERATOR FILTERING
    // =============================================================

    function setApprovalForAll(
        address operator,
        bool approved
    ) public override(ERC721A) onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, approved);
    }

    function approve(
        address operator,
        uint256 tokenId
    ) public payable override(ERC721A) onlyAllowedOperatorApproval(operator) {
        super.approve(operator, tokenId);
    }

    // =============================================================
    //                           ERC165
    // =============================================================

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721A, ERC2981) returns (bool) {
        return
            ERC721A.supportsInterface(interfaceId) ||
            ERC2981.supportsInterface(interfaceId);
    }

    // =============================================================
    //                           ERC2981
    // =============================================================

    function setDefaultRoyalty(
        address receiver,
        uint96 feeNumerator
    ) public onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // =============================================================
    //                           METADATA
    // =============================================================

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length != 0
                ? string(abi.encodePacked(baseURI, _toString(tokenId), ".json"))
                : "";
    }
}
