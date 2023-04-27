/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.9',
    defaultNetwork: 'goeri',
    networks:{
      hardhat:{},
      goerli:{
        url:'https://eth-goerli.g.alchemy.com/v2/WrAsIcopBRVoa0meScNqdCeIHJUDZT7l',
        accounts:[`0x50718ff10f5424f1354bdec713569caf37283945683d917a95450486c5cc742c`] //${process.env.PRIVATE_KEY}
      }
    },
   
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
