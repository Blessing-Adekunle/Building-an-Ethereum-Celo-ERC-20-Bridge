// Truffle Test Script
contract("EthereumBridge", (accounts) => {
    it("should lock tokens on Ethereum", async () => {
        const bridge = await EthereumBridge.deployed();
        const token = await ERC20Token.deployed();

        // Perform token locking
        const amount = web3.utils.toWei("100", "ether");
        await token.approve(bridge.address, amount, { from: accounts[0] });
        const tx = await bridge.lockTokens(amount, { from: accounts[0] });

        // Verify event emission
        const event = tx.logs[0];
        assert.equal(event.event, "TokensLocked");
        assert.equal(event.args.sender, accounts[0]);
        assert.equal(event.args.amount, amount);
    });
});