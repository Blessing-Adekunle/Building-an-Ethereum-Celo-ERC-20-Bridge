// Celo Bridge Contract
contract CeloBridge {
    uint256 public lockPeriod = 24 hours; // Example lock period

    mapping(address => uint256) public lastLockTimestamp;

    function lockTokens(uint256 amount) external {
        require(lastLockTimestamp[msg.sender] + lockPeriod <= block.timestamp, "Tokens locked within lock period");
        
        // Lock tokens and update the last lock timestamp for the sender
        // ...
    }
}