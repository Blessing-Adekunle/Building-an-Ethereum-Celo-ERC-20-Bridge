// Hardhat Test Script
describe("CeloBridge", () => {
    it("should unlock tokens on Celo", async () => {
        const bridge = await ethers.getContract("CeloBridge");
        const token = await ethers.getContract("ERC20Token");

        // Perform token unlocking
        const amount = ethers.utils.parseEther("100");
        await token.connect(signer).approve(bridge.address, amount);
        const tx = await bridge.connect(signer).unlockTokens(amount);

        // Verify event emission
        const event = tx.events[0];
        expect(event.event).to.equal("TokensUnlocked");
        expect(event.args.sender).to.equal(signer.address);
        expect(event.args.amount).to.equal(amount);
    });
});