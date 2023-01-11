// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OperatorFilterer} from "closedsea/src/OperatorFilterer.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {ERC721A} from "erc721a/contracts/ERC721A.sol";

error InvalidSaleState();
error NotOnAllowlist();
error MaxSupplyReached();
error InvalidQuantity();

contract Token is Ownable, OperatorFilterer, ERC2981, ERC721A {
    enum SaleStates {
        CLOSED,
        ALLOWLIST,
        PUBLIC
    }

    uint256 public constant MAX_SUPPLY = 100;
    uint256 public constant MAX_PER_MINT = 3;

    SaleStates public saleState;
    address public royaltyReceiver;
    bool public operatorFilteringEnabled = true;
    string public _baseTokenURI = "";

    constructor() ERC721A("Token", "TOKEN") {
        _registerForOperatorFiltering();
        // Set initial 5% royalty
        // _setDefaultRoyalty(royaltyReceiver, 500);
    }

    // =============================================================
    //                       MINT FUNCTIONS
    // =============================================================

    function allowlistMint() external {
        if (saleState != SaleStates.ALLOWLIST) revert InvalidSaleState();

        uint64 numAllowlists = _getAux(msg.sender);
        if (numAllowlists == 0) revert NotOnAllowlist();
        if (_totalMinted() + 1 > MAX_SUPPLY) {
            revert MaxSupplyReached();
        }

        _setAux(msg.sender, numAllowlists - 1);
        _mint(msg.sender, 1);
    }

    function publicMint(uint256 qty) external {
        if (saleState != SaleStates.PUBLIC) revert InvalidSaleState();
        if (qty > MAX_PER_MINT) revert InvalidQuantity();
        if (_totalMinted() + qty > MAX_SUPPLY) {
            revert MaxSupplyReached();
        }
        _mint(msg.sender, qty);
    }

    // =============================================================
    //                    OWNER ONLY FUNCTIONS
    // =============================================================

    function ownerMint(address to, uint256 quantity) external onlyOwner {
        if (_totalMinted() + quantity > MAX_SUPPLY) {
            revert MaxSupplyReached();
        }
        _mint(to, quantity);
    }

    function setSaleState(uint256 newSaleState) external onlyOwner {
        saleState = SaleStates(newSaleState);
    }

    function setAllowlist(address[] calldata addresses) external onlyOwner {
        for (uint256 i; i < addresses.length; ) {
            _setAux(addresses[i], 1);
            unchecked {
                ++i;
            }
        }
    }

    function isOnAllowlist(address user) external view returns (bool) {
        return _getAux(user) > 0;
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

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override(ERC721A) onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override(ERC721A) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public payable override(ERC721A) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function setOperatorFilteringEnabled(bool value) public onlyOwner {
        operatorFilteringEnabled = value;
    }

    function _operatorFilteringEnabled() internal view override returns (bool) {
        return operatorFilteringEnabled;
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
