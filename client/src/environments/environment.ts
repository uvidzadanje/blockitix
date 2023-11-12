// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import abi from "../abi/abi.json";

export const environment = {
  production: false,
  blockitixAbi: abi.blockitixABI,
  blockitixContractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  authServiceURL: "http://localhost:5000",
  ipfsServiceURL: "http://localhost:5001",
  ipfsStorageURL: "http://localhost:8080/ipfs",
  clientURL: "http://localhost:4200"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
