import { mine } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

async function main() {
  const deployer = await ethers.getSigners();

  console.log(`Deploying contract from: ${deployer[0].address}`);

  const NAME = "BLOCKITIX";
  const SYMBOL = "BT";

  const Blockitix = await ethers.getContractFactory("Blockitix");
  const blockitixContract = await Blockitix.deploy(NAME, SYMBOL);

  await blockitixContract.waitForDeployment();

  await mine(15); // to solving bug with event emit

  console.log(`Deployed Blockitix Contract at: ${await blockitixContract.getAddress()}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
