import abi from "../abi/abi.json";

export const environment = {
  production: true,
  blockitixAbi: abi.blockitixABI,
  blockitixContractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  authServiceURL: "http://localhost:5000",
  ipfsServiceURL: "http://localhost:5001",
  ipfsStorageURL: "http://localhost:8080/ipfs",
  clientURL: "http://192.168.1.5:80"
};
