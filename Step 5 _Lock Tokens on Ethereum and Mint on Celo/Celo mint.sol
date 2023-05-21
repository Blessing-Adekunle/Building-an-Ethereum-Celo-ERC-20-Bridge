// Celo Bridge Contract
contract CeloBridge {
    // ERC-20 token contract address on Celo
    address public celoTokenAddress;

    // Event emitted when tokens are minted on Celo
    event TokensMinted(address indexed receiver, uint256 amount);

    function mintTokens(address receiver, uint256 amount) external {
        // Mint tokens on Celo and assign them to the receiver
        tokenMint(receiver, amount);

        // Emit event to indicate tokens minted on Celo
        emit TokensMinted(receiver, amount);
    }
}