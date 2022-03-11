// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./ERC165.sol";
import "./interfaces/IERC721.sol";

// building out the minting function:
  // a. nft to point to an address
  // b. keep track of the token ids
  // c. keep track of the token owner addresses to token ids
  // d. keep track of how many tokens an owner address has
  // e. create an event that emits a transfer log - contract address, where it is being minted to, the id

contract ERC721 is ERC165, IERC721 {

  //event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
  //event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
  event ApprovalForAll(address indexed sender, address indexed operator, bool indexed approved);

  mapping(uint256 => address) private _tokenOwner;
  mapping(address => uint256) private _ownedTokensCount;

  mapping(uint256 => address) private _tokenApprovals;
  mapping(address => mapping(address => bool)) private _operatorApprovals;

  constructor() {
    _registerInterface(bytes4(keccak256("balanceOf(bytes4)")^
    keccak256("ownerOf(bytes4)")^keccak256("transferFrom(bytes4)")));
  }

  function balanceOf(address _owner) public override view returns (uint256) {
    require(_owner != address(0), "ERC721: owner query for non-existent token");
    return _ownedTokensCount[_owner];
  }

  function ownerOf(uint256 _tokenId) public override view returns (address) {
    address owner = _tokenOwner[_tokenId];
    require(owner != address(0), "ERC721: owner query for non-existent token");
    return owner;
  }

  function _exists(uint256 tokenId) internal view returns(bool) {
    address owner = _tokenOwner[tokenId];
    return owner != address(0);
  }

  function _mint(address to, uint256 tokenId) internal virtual {
    require(to != address(0), "ERC721: minting to the zero address");
    require(!_exists(tokenId), "ERC721: token already minted");

    _tokenOwner[tokenId] = to;
    _ownedTokensCount[to] += 1;

    emit Transfer(address(0), to, tokenId);
  }

  function _transferFrom(address _from, address _to, uint256 _tokenId) internal {
    address owner = ownerOf(_tokenId);

    require(msg.sender == owner, "ERC721: sender is not the owner of the token");
    require(_from == owner, "ERC721: from address need to be the owner of the token");
    require(_to != address(0), "ERC721: sending to the zero address");

    _ownedTokensCount[_from] -= 1;

    _tokenOwner[_tokenId] = _to;
    _ownedTokensCount[_to] += 1;

    emit Transfer(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) public override {
    require(isApprovedOrOwner(msg.sender, _tokenId), "sender need to be approved or owner");
    _transferFrom(_from, _to, _tokenId);
  }

  function approve(address _to, uint256 _tokenId) public {
    address owner = ownerOf(_tokenId);

    require(_to != owner, "ERC721: approval to current owner");
    require(msg.sender == owner, "ERC721: current caller is not the owner of the token");

    _tokenApprovals[_tokenId] = _to;

    emit Approval(owner, _to, _tokenId);
  }

  function isApprovedOrOwner(address _spender, uint256 _tokenId) internal view returns(bool) {
    require(_exists(_tokenId), "token does not exist");
    address owner = ownerOf(_tokenId);
    return (_spender == owner || getApproved(_tokenId) == _spender || isApprovedForAll(owner, _spender));
  }

  function setApprovalForAll(address operator, bool approved) public {
    require(operator != msg.sender, "ERC721: approve to caller");

    _operatorApprovals[msg.sender][operator] = approved;
    emit ApprovalForAll(msg.sender, operator, approved);
  }

  function isApprovedForAll(address owner, address operator) public view returns (bool) {
    return _operatorApprovals[owner][operator];
  }

  function getApproved(uint256 tokenId) public view returns (address) {
    require(_exists(tokenId), "ERC721: approved query for nonexistent token");

    return _tokenApprovals[tokenId];
  }
}