// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
pragma experimental ABIEncoderV2;


contract NFTContract is ERC1155, Ownable, ERC1155Supply {

    uint public constant NFT0 = 0;
    uint public constant NFT1 = 1;
    uint public constant NFT2 = 2;

    address contractBeneficiary;

    uint public totalRaised =  0 ether;

    event Donation(address indexed _from , uint256 time , uint value);

    struct Donator{
        address donatorAddresses;
        uint valueSent;
    }

    Donator[] donators;



   constructor(address beneficiary) ERC1155("ipfs://Qmaic5hHWtPg6NXvJYxXbLXN6zexwNp9A42j6zSseQwqQh/") {
       contractBeneficiary = beneficiary;
   }

   function withdraw() external onlyOwner{
       uint256 balance = address(this).balance;
       payable(contractBeneficiary).transfer(balance);

   }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint() public payable {

        require(msg.value >= 0.01 ether , "please send more than 0.01 ether to contitnue");

        if(msg.value == 0.01 ether){
            _mint(msg.sender , NFT0 , 1 ,"");
        }
        
        if(msg.value == 0.5 ether){
            _mint(msg.sender , NFT1 , 1 ,"");
        }
        
        if(msg.value == 1 ether){
            _mint(msg.sender , NFT2 , 1 ,"");
        }

        // _mint(msg.sender , _id , 1 , "");



        totalRaised += msg.value;
        emit Donation(msg.sender , block.timestamp , msg.value);
        Donator memory newDonator = Donator(msg.sender , msg.value);
        donators.push(newDonator);

    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function getDonators() external view returns(Donator[] memory){
        return donators;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function uri(uint256 _id)  public view override returns(string memory){
        require(exists(_id), "URI NONEXISTENT TOKEN");
        return string(abi.encodePacked(super.uri(_id),Strings.toString(_id) , ".json"));
    }
}
