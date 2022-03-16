// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library SafeMath {
  function add(uint256 x, uint256 y) internal pure returns(uint256) {
    uint256 r = x + y;
    require(r >= x, 'SafeMath: Addition Overflow');
    return r;
  }

  function sub(uint256 x, uint256 y) internal pure returns(uint256) {
    require(y <= x, 'SafeMath: Subtraction Overflow');
    uint256 r = x - y;
    return r;
  }

  function mul(uint256 x, uint256 y) internal pure returns(uint256) {
    if (x == 0) { // gas optimization
      return 0;
    }
    uint256 r = x * y;
    require(r / x == y, 'SafeMath: Multiplication Overflow');
    return r;
  }

  function div(uint256 x, uint256 y) internal pure returns(uint256) {
    require(y > 0, 'SafeMath: Division by zero');
    uint256 r = x / y;
    return r;
  }

  function mod(uint256 x, uint256 y) internal pure returns(uint256) {
    require(y != 0, 'SafeMath: Modulo by zero');
    return x % y;
  }
}