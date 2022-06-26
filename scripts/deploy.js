const hre = require('hardhat')

async function main() {
  const NFTContract = await hre.ethers.getContractFactory('NFTContract')
  const nftContract = await NFTContract.deploy(
    '0xEc12e2d4467BbE6378dE5dC3088Ac82F62EbdE36',
  )

  await nftContract.deployed()

  console.log('NFT Contract is  deployed to:', nftContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
