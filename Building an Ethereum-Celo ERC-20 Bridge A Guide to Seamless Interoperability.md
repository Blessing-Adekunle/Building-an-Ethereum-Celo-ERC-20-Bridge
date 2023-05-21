
# Building an Ethereum-Celo ERC-20 Bridge: A Guide to Seamless Interoperability
# Introduction:
We'll look at how to build an ERC-20 bridge between Ethereum and Celo in this tutorial. This will make moving tokens between the two platforms easy and help them work better together. By taking these steps, you can enable smooth token transfers and foster interoperability. Let's dive in!
# Prerequisites
* A proper understanding of Solidity and ERC-20 standard is needed for this tutorial.
* Be well-versed in javascript and be comfortable with using Truffles console.

# Requirements
Before you get started, you’ll need the following:
* A working laptop
* Internet access
* IDE environment of choice(VsCode or Remix recommended)


# Step 1: Setting Up the Development Environment
Install Node.js, the Solidity engine, and the Truffle framework to get things started. Without these, the bridge can't be built. To set up Node.js, the Solidity engine, and the Truffle framework, follow this process:

## Installing Node.js:
Visit https://nodejs.org and download the appropriate file for your OS. To finish the process, run the installer and follow the on-screen instructions.

## Installing the Solidity Compiler (solc):
Open a command box or terminal.
Run the following command to install the Solidity compiler globally:

```powershell
npm install -g solc
```


## Installing Truffle Framework:
Open a terminal or command prompt.
Run the following command to install Truffle globally:

```powershell
npm install -g truffle
```


## Verify the installations:
Run the following lines in the terminal or command prompt to make sure that Node.js and npm (Node Package Manager) are set up correctly:

```css
node --version
npm --version
```

These commands would show the versions of Node.js and npm that have been installed.

To verify that Solidity compiler (solc) and Truffle are installed correctly, run the following commands:

```css
solc --version
truffle version
```

These commands would show the versions of Solidity compiler and the Truffle framework that are installed.

Note: Depending on your operating system,the installation process may differ. 

# Step 2: Make the contracts for the ERC-20 tokens
We'll be following standard guidelines to make ERC-20 contracts on Ethereum and Celo. These contracts will be used to represent the bridge's coins.
An Ethereum ERC-20 contract for the tutorial token; CeloXSama:

```solidity
// The ERC-20 contract for Ethereum
contract MyToken {
    string public name = "CeloXSama";
    string public symbol = "CXS";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 initialSupply) {
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
    }

    function transfer(address to, uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 amount) public {
        allowance[msg.sender][spender] = amount;
    }

    function transferFrom(address from, address to, uint256 amount) public {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance exceeded");

        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
    }
}
```

Celo ERC-20 Contract for the tutorial token; CeloXSama:

```solidity
// Celo ERC-20 Contract
contract CeloXSama is CeloToken {
    constructor(uint256 initialSupply) CeloToken("CeloXSama", "CXS") {
        _mint(msg.sender, initialSupply);
    }
}
```


In the cases above, we made ERC-20 token contracts for the Ethereum and Celo networks. The contract for Ethereum is called CeloXSama. It has a constructor that sets up the name, symbol, and number of decimal places for the token. The entire supply of tokens is shown by the totalSupply variable, and token amounts and allowances are kept track of by the balanceOf and allowance mappings. Functions like transfer, accept, and transferFrom are built into the contract to handle transfers and approvals of tokens.

For Celo, the contract extends the CeloToken contract provided by the Celo protocol. Using the _mint method, the constructor sets the name and symbol of the token and sends the initial supply to the contract deployer.
You are welcome to change the contracts to meet the needs of your tokens.

# Step 3: Putting the contracts in place
Build bridge contracts on both Ethereum and Celo that lock and open tokens between the two networks. These contracts will help make sure of seamless transfers.

For Ethereum:

```solidity
agreement EthereumBridge
external function lockTokens(address receiver, uint256 amount)
// Move and lock the ERC-20 tokens to the bridge.
}

function unlockTokens(address receiver, uint256 amount) external {
// On Ethereum, give the named person access to locked tokens.
}
}
```

For Celo:

```solidity
deal with CeloBridge
external function lockTokens(address receiver, uint256 amount)
// Move and lock the ERC-20 tokens to the bridge.
}

function unlockTokens(address receiver, uint256 amount) external {
// Give the given Celo receiver access to the locked tokens.
}
}
```

# Step 4: Deploy Contracts to Networks
To deploy our token contracts and bridge contracts, we utilized Truffle migrations.
We created a migration file, such as "2_deploy_contracts.js", in the migrations directory. In the migration file, specify the deployment steps for each contract, then use Truffle's deployment scripts to execute the migrations.

```javascript
const TokenContract = artifacts.require("CeloXSama");
const BridgeContract = artifacts.require("EthereumBridge");

module.exports = function(deployer) {
  deployer.deploy(TokenContract, { gas: 5000000 });
  deployer.deploy(BridgeContract, TokenContract.address, { gas: 5000000 });
}
```

Customize the migration script based on your contract names and configurations.
Run the migration command in the terminal: truffle migrate --network [network_name].
Ensure you have the correct network configuration in the Truffle configuration file (truffle-config.js or truffle.js) for the desired network.

By following these steps, you can successfully deploy your token contracts and bridge contracts using Truffle migrations. This process allowed us to initialize our contracts on the Ethereum and Celo networks, preparing them for seamless token transfers.

# Step 5: Lock Tokens on Ethereum and Mint on Celo
To initiate token transfers, we lock our ERC-20 tokens on Ethereum, which triggers the minting process on Celo.

## Locking Tokens on Ethereum:
During interaction with the Ethereum bridge contract. We call the lockTokens function and specify the amount of tokens to lock. The bridge contract verifies the token balance and approves the lock. Once approved, the bridge contract emits an event indicating a successful lock.

```solidity
// Ethereum Bridge Contract
contract EthereumBridge {
    // ERC-20 token contract address on Ethereum
    address public ethTokenAddress;

    // Event emitted when tokens are locked on Ethereum
    event TokensLocked(address indexed sender, uint256 amount);

    function lockTokens(uint256 amount) external {
        // Ensure user has sufficient balance and allowances
        require(tokenBalanceOf(msg.sender) >= amount, "Insufficient balance");
        require(tokenAllowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        // Lock tokens by transferring them to the bridge contract
        tokenTransferFrom(msg.sender, address(this), amount);

        // Emit event to signal tokens locked
        emit TokensLocked(msg.sender, amount);
    }
}
```

## Minting Equivalent Tokens on Celo:
The bridge contract on Ethereum emits an event containing the locked token details.
An off-chain oracle service listens for these events and detects the lock.
The oracle service communicates with the Celo bridge contract.
Based on the event data, the Celo bridge contract mints an equivalent amount of tokens.
The minted tokens are assigned to the user's Celo address.
This process allows users to securely lock their tokens on Ethereum, triggering the creation of equivalent tokens on Celo.
```solidity
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
```

By following these steps, we lock CeloXSama ERC-20 tokens on Ethereum, initiating the minting process on Celo. This enables seamless token transfers between the two networks and promotes interoperability.

# Step 6: Unlock Tokens on Celo and Burn on Ethereum
By following these steps, users can unlock their tokens on Celo, initiating the burning process on Ethereum to retrieve their original tokens.

We interact with the Celo bridge contract, then call the unlockTokens function and specify the amount of tokens to unlock. The bridge contract verifies the our token balance and approves the unlock.
Once approved, the bridge contract emits an event indicating a successful unlock. 
## Unlocking Tokens on Celo:

```solidity
// Celo Bridge Contract
contract CeloBridge {
    // ERC-20 token contract address on Celo
    address public celoTokenAddress;

    // Event emitted when tokens are unlocked on Celo
    event TokensUnlocked(address indexed sender, uint256 amount);

    function unlockTokens(uint256 amount) external {
        // Ensure user has sufficient balance on Celo
        require(tokenBalanceOf(msg.sender) >= amount, "Insufficient balance");

        // Burn the equivalent amount of tokens on Ethereum
        EthereumBridge(addressOfEthereumBridgeContract).burnTokens(msg.sender, amount);

        // Emit event to indicate tokens unlocked on Celo
        emit TokensUnlocked(msg.sender, amount);
    }
}
```

## Burning Equivalent Tokens on Ethereum:
The bridge contract on Celo emits an event containing the unlocked token details. An off-chain oracle service listens for these events and detects the unlock. The oracle service communicates with the Ethereum bridge contract.

Based on the event data, the Ethereum bridge contract burns an equivalent amount of tokens.
The burned tokens are permanently removed from circulation. Through this process, we can unlock our tokens on Celo, trigger the burning of equivalent tokens on Ethereum, and retrieve our original tokens.

```solidity
// Ethereum Bridge Contract
contract EthereumBridge {
    // ERC-20 token contract address on Ethereum
    address public ethTokenAddress;

    // Event emitted when tokens are burned on Ethereum
    event TokensBurned(address indexed sender, uint256 amount);

    function burnTokens(address sender, uint256 amount) external {
        // Burn tokens by deducting the balance from the sender
        tokenBalance[sender] -= amount;

        // Emit event to indicate tokens burned on Ethereum
        emit TokensBurned(sender, amount);
    }
}
```

By utilizing the above code, We unlock our CXS on Celo, triggering the burning of equivalent tokens on Ethereum. This allows us to retrieve our original tokens and maintain interoperability between the two networks.

# Step 7: Test Bridge Functionality
To ensure the reliability and functionality of your bridge, create comprehensive tests using Truffle and network-specific frameworks.

## Testing with Truffle:
Write test scripts using the Truffle testing framework.
Cover various scenarios, including token locking, unlocking, and event emissions.
Test contract interactions, function executions, and expected outcomes.
Utilize Truffle's assertion library to verify expected results.

```javascript
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
```


## Network-Specific Testing:
Use network-specific frameworks like Hardhat or Waffle for additional testing.
Deploy contracts and simulate user interactions on respective networks.
Verify contract functionality, event emissions, and token transfers.
Test edge cases, error handling, and contract security measures.
By conducting thorough tests, you ensure the robustness and correctness of your bridge implementation.

```javascript
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
```

By using these testing approaches, we create comprehensive tests to verify the functionality of your bridge. Thorough testing helps ensure seamless token transfers and promotes interoperability between the networks.

# Step 8: Enhance Security and Auditability
To enhance the security and auditability of our bridge, we implement time-based restrictions and multi-signature approvals for added security. Additionally, conduct audits to identify and address vulnerabilities. Here's an expanded explanation you can follow:

## Implement Time-Based Restrictions:
Implement time-based restrictions to control token locking and unlocking periods. This ensures that tokens can only be locked or unlocked within specified timeframes, reducing the risk of unauthorized transfers.

```solidity
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
```

## Multi-Signature Approvals:
Utilize multi-signature approvals for critical bridge operations. This requires multiple authorized parties to sign off on transactions, adding an extra layer of security and preventing single points of failure.

```solidity
// Celo Bridge Contract
contract CeloBridge {
    address[] public signers;
    mapping(address => bool) public isSigner;

    function unlockTokens(uint256 amount, bytes32[] calldata signatures) external {
        require(signatures.length >= signers.length / 2 + 1, "Insufficient signatures");

        // Verify signatures and proceed with token unlocking
        // ...
    }
}
```

## Conducting Audits:
Regularly conduct comprehensive audits of your bridge's smart contracts. Consider engaging external security firms to perform thorough security assessments. Here's an example of a high-level audit checklist:
* Review contract logic and architecture for potential vulnerabilities.
* Conduct automated security analysis using tools like MythX and Slither.
* Perform manual code review to identify coding errors and insecure practices.
* Test the bridge with various scenarios and edge cases to ensure robustness.
* Validate adherence to industry best practices and security standards.
* Address any identified vulnerabilities promptly to maintain a secure bridge.

Doing these will significantly enhance the security and auditability of your bridge, safeguarding user assets and promoting trust in the system.

# Conclusion:
By following this tutorial, you've learned how to build and deploy an ERC-20 bridge between Ethereum and Celo, establishing interoperability and enabling seamless token transfers. This bridge opens up new possibilities for users and projects, fostering collaboration and expanding the decentralized ecosystem. Start exploring the potential of cross-chain connectivity today!

# Next Steps
Did you follow through and understood the process; looking forward to hearing your experience. These are other topics I will work on in the future, Stay tuned:
* Implementing Cross-Chain Communication: Detailing the technical implementation of cross-chain communication between Ethereum and Celo, including message passing, event listening, and synchronization methods.
* Expanding Interoperability: Exploring possibilities beyond token transfers, such as extending interoperability to smart contract calls, cross-chain dApp integrations, and decentralized finance (DeFi) protocols.
* Future of Interoperability: Delving into emerging trends, technological advancements, and research efforts in blockchain interoperability, such as cross-chain smart contract execution, data oracles, or interoperability-focused layer-1 blockchains.

# About the Author
Blessing is a skilled technical writer and developer. He excels at creating user-friendly content and with his  strong coding expertise, Blessing combines clarity and functionality in their work.

# References
* https://celo.academy/t/how-to-swap-celo-tokens-on-uniswap-programmatically-with-code/230
* https://celo.academy/t/introduction-to-erc-20r-and-reversible-transactions/178
* https://celo.academy/t/a-guide-to-building-and-deploying-upgradeable-contracts-on-celo-with-diamond-standard/152
