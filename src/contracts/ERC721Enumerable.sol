// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import './ERC721.sol';
import "./interfaces/IERC721Enumerable.sol";

contract ERC721Enumerable is IERC721Enumerable, ERC721 {

  uint256[] private _allTokens;
  mapping(uint256 => uint256) private _allTokensIndex;
  mapping(address => uint256[]) private _ownedTokens;
  mapping(uint256 => uint256) private _ownedTokensIndex;

  constructor() {
    _registerInterface(bytes4(keccak256("totalSupply(bytes4)")^
    keccak256("tokenByIndex(bytes4)")^keccak256("tokenOfOwnerByIndex(bytes4)")));
  }

  function totalSupply() public override view returns (uint256) {
    return _allTokens.length;
  }

  function tokenByIndex(uint256 _index) public override view returns (uint256) {
    require(_index < totalSupply(), "Global index is out of bounds!");
    return _allTokens[_index];
  }

  function tokenOfOwnerByIndex(address _owner, uint256 _index) public override view returns (uint256) {
    require(_index < super.balanceOf(_owner), "Owner index is out of bounds!");
    return _ownedTokens[_owner][_index];
  }

  function _mint(address to, uint256 tokenId) internal  override(ERC721) {
    super._mint(to, tokenId);

    _allTokensIndex[tokenId] = _allTokens.length;
    _allTokens.push(tokenId);

    _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
    _ownedTokens[to].push(tokenId);
  }
}