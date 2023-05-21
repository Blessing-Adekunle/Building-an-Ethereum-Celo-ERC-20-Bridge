// Celo ERC-20 Contract
contract CeloXSama is CeloToken {
    constructor(uint256 initialSupply) CeloToken("CeloXSama", "CXS") {
        _mint(msg.sender, initialSupply);
    }
}