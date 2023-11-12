import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 77,
          },
        },
      }
    ]
  },
  networks: {
    hardhat: {
      chainId: 1337, // default is 31337
    }
  }
};

export default config;
