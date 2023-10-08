import { ethers } from "hardhat";

async function main() {
  const deployer = await ethers.getSigners();

  // console.log(`Deploying contract from: ${deployer[0].address}`);

  const NAME = "BLOCKITIX";
  const SYMBOL = "BT";

  const Blockitix = await ethers.getContractFactory("Blockitix");
  const blockitixContract = await Blockitix.deploy(NAME, SYMBOL);

  const User = await ethers.getContractFactory("User");
  const userContract = await User.deploy();

  await blockitixContract.waitForDeployment();
  await userContract.waitForDeployment();

  console.log(`Deployed Blockitix Contract at: ${await blockitixContract.getAddress()}\n`);
  console.log(`Deployed User Contract at: ${await userContract.getAddress()}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
