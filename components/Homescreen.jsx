import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { BigNumber, ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { contractAddress, NFTabi } from '../utils/constants'
import toast from 'react-hot-toast'

const Homescreen = () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: 'INFURA_ID', // required
      },
    },
  }

  const [account, setAccount] = useState('')
  const [contract, setContract] = useState()
  const inputRef = useRef()
  const [donators, setDonators] = useState()
  const shortenAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`
  }

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        network: 'mainnet',
        providerOptions,
        cacheProvider: true,
        disableInjectedProvider: false,
      })

      const instance = await web3Modal.connect().catch((e) => console.log(e))

      const provider = (await new ethers.providers.Web3Provider(instance)) || ''
      const signer = provider.getSigner()
      setAccount((await signer.getAddress()).toString()), console.log(account)
      console.log(account)
    } catch (error) {
      console.log(error.message)
    }
  }

  const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const nftContract = new ethers.Contract(contractAddress, NFTabi, signer)
    return nftContract
  }

  const fetch = async () => {
    const myContract = await getEthereumContract()
    setDonators(await myContract.getDonators())
    // console.log(donators)
  }

  const mintNFT = async () => {}

  useEffect(() => {
    connectWallet()
    fetch()
  })
  return (
    <div className="flex items-center flex-col">
      {/* TOP  */}

      <div className="flex items-center justify-center mt-3">
        <Image
          alt=""
          src={require('../images/marvel.png')}
          height={130}
          width={300}
        />
      </div>

      <div className="mt-2 p-2 bg-white text-center cursor-pointer  rounded-full">
        {account ? (
          <p>Connected With: {shortenAddress(account)}</p>
        ) : (
          <p onClick={connectWallet}>Connect Wallet</p>
        )}
      </div>
      {/* NFT display  */}

      <div className="flex flex-col place-items-center place-content-center space-x-0 lg:flex-row lg:space-x-24">
        <div className="w-fit flex items-center justify-center flex-col">
          <p className="text-center font-extrabold text-white my-2">
            Price : 0.01 ETH
          </p>
          <Image
            src={require('../metadeta/image0.png')}
            alt=""
            height={300}
            width={200}
          />
        </div>
        <div className="w-fit flex items-center justify-center flex-col">
          <p className="text-center text-white font-extrabold my-2">
            Price : 0.5 ETH
          </p>
          <Image
            src={require('../metadeta/image1.png')}
            alt=""
            height={300}
            width={200}
          />
        </div>
        <div className="w-fit flex items-center justify-center flex-col">
          <p className="text-center text-white font-extrabold my-2">
            Price : 1 ETH
          </p>
          <Image
            src={require('../metadeta/ironman2.png')}
            alt=""
            height={300}
            width={200}
          />
        </div>
      </div>

      {/* bottom  */}

      {account ? (
        <div className="flex flex-col justify-center items-center mt-14 border-2 rounded-lg border-yellow-400">
          <input
            ref={inputRef}
            type="number"
            name=""
            id=""
            className="bg-transparent outline-none text-center text-white"
            placeholder="Enter value in ETH"
          />
          <button
            onClick={async () => {
              const notification = toast.loading('Minting your Superhero ⚡️')
              try {
                const myContract = await getEthereumContract()

                console.log(myContract)
                await myContract.mint({
                  value: ethers.utils.parseEther(`${inputRef.current.value}`),
                })

                toast.success('Your Superhero is Minted ✨', {
                  id: notification,
                })
              } catch (error) {
                console.log(error)
                toast.error(
                  'Whoops , something went wrong! or Insufficient Funds',
                  {
                    id: notification,
                  },
                )
              }
            }}
            className="p-1 my-2 w-[150px] bg-yellow-500 rounded-lg"
          >
            Mint
          </button>
        </div>
      ) : (
        <button
          onClick={async () => {
            connectWallet()
            const notification = toast.loading('Wallet Connected ⚡️')
          }}
          className="p-1 mt-4 w-[150px] bg-yellow-500 rounded-lg "
        >
          Collect Wallet
        </button>
      )}

      <div className="flex items-center justify-center flex-col mt-5">
        <div className="flex space-x-20 text-white font-bold text-lg">
          <p>Addresses</p>
          <p>Value Spent</p>
        </div>
        <div className="w-full max-w-3xl flex items-start justify-center flex-col  text-left">
          {donators &&
            donators.map((data) => {
              return (
                <div
                  key={data.donatorAddresses}
                  className="text-white flex space-x-20 justify-start"
                >
                  <div>
                    <p>{shortenAddress(data.donatorAddresses)}</p>
                  </div>
                  <div>
                    <p>{data.valueSent.toString() / 10 ** 18}</p>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default Homescreen

{
  /* <p>{data.valueSent.toString() / 10 ** 18}</p> */
}
