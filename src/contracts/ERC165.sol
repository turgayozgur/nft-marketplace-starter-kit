// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IERC165.sol";

contract ERC165 is IERC165 {

  function calcFingerPrint() public pure returns (bytes4) {
    return bytes4(keccak256("supportsInterface(bytes4)"));
  }

  mapping(bytes4 => bool) private _supportedInterfaces;

  function supportsInterface(bytes4 interfaceID) public override view returns (bool) {
    return _supportedInterfaces[interfaceID];
  }

  constructor() {
    _registerInterface(calcFingerPrint());
  }

  function _registerInterface(bytes4 interfaceID) public {
    require(interfaceID != 0xffffffff, "ERC165: invalid interface");
    _supportedInterfaces[interfaceID] = true;
  }
}