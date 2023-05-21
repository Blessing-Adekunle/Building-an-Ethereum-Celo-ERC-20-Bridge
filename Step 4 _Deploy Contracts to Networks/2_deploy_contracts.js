const TokenContract = artifacts.require("CeloXSama");
const BridgeContract = artifacts.require("EthereumBridge");

module.exports = function(deployer) {
  deployer.deploy(TokenContract, { gas: 5000000 });
  deployer.deploy(BridgeContract, TokenContract.address, { gas: 5000000 });
}