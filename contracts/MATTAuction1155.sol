import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MATTAuction1155 is ERC1155, Ownable {

    struct TokenData {  
        address owner;
        uint256 tokenID;
        uint price;
    }

    address public feeContractAddress;
    bool public minting;
    mapping(address => bool) public allowedAddresses;

    modifier onlyAllowed() {
        require(allowedAddresses[msg.sender], "Access denied");
        _;
    }

    modifier isMinting() {
        require(minting, "Is not Minting");
        _;
    }

    constructor(address feeContractAddress_) ERC1155("https://bafybeihw6ulr6ooeavb4dpf6wof4u4cx6hc5s4xgfqw47iw72jyt7vdtla.ipfs.nftstorage.link/{id}.json") {
        feeContractAddress = feeContractAddress_;
        allowedAddresses[msg.sender] = true;
        minting = true;
    }

    function bid(TokenData[] memory tokenData) onlyAllowed isMinting external {
        minting = false; 
        for(uint i = 0; i < tokenData.length; i++) {
            require(IERC20(feeContractAddress).transferFrom(tokenData[i].owner, address(this), tokenData[i].price), "TransferFrom");
            _mint(tokenData[i].owner, tokenData[i].tokenID, 1, "");
        }
    }

    function addToMultiSigList(address _address) onlyAllowed public {
        allowedAddresses[_address] = true;
    }

    function withdrawFunds(uint amount) onlyAllowed external {
        IERC20(feeContractAddress).transferFrom(address(this), msg.sender, amount);
    } 
}