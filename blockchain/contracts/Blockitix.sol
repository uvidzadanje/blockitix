// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

import "hardhat/console.sol";

contract Blockitix is Ownable, ERC721, ERC721URIStorage, ERC721Burnable {
    bool private stopped = false;

    struct EventData {
        uint256 id;

        string name;

        uint totalTickets;

        uint remainingTickets;

        string seatsFormatURL;

        address owner;

        string datetime;

        string city;

        string location;

        bool isCanceled;

        string coverURL;

        string descriptionURL;

        string category;
    }

    mapping(uint256 => SeatType[]) eventSeatTypes;

    // seatIdFormat: layoutName;row;column

    // eventId => seatIdFormat 
    mapping(uint256 => string[]) seatsTaken;

    // eventId => seatIdFormat => ticketId
    mapping(uint256 => mapping (string => uint256)) seatTicket;

    struct TicketData {
        uint256 id;

        uint256 eventId;

        address owner;

        string seatFormat;
    }

    struct SeatType {
        string name;

        string colorMark;

        uint price;
    }

    struct Token {
        string seatId;

        string tokenURI;
    }
    
    uint256 totalEvents;
    uint256 totalTickets;

    mapping(uint256 => EventData) events;
    uint256[] eventIds;

    mapping(uint256 => TicketData) tickets;
    uint256[] ticketIds;

    event EventCreated(uint indexed eventId, address indexed creator);

    event EventUpdated(uint indexed eventId);

    event BoughtTickets(uint[] ticketIds, address buyer);

    modifier stopInEmergency() {
        require(!stopped, "Contract is in emergency stop");
        _;
    }
    
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) { }

    function toggleEmergencyStop() public onlyOwner {
        stopped = !stopped;
    }

    function createEvent(
        string memory _name,
        uint _totalTickets,
        string memory _seatFormat,
        string memory _datetime,
        string memory _city,
        string memory _location,
        string memory _coverURL,
        string memory _descriptionURL,
        string memory _category,
        SeatType[] memory _seatTypes
        ) external stopInEmergency returns (uint) {
            
        totalEvents++;
        events[totalEvents] = EventData(totalEvents, _name, _totalTickets, _totalTickets, _seatFormat, msg.sender, _datetime, _city, _location, false, _coverURL, _descriptionURL, _category);
        eventIds.push(totalEvents);

        uint256 seatTypesLength = _seatTypes.length;
        for (uint i = 0; i < seatTypesLength; i++) {
            eventSeatTypes[totalEvents].push(_seatTypes[i]);
        }

        emit EventCreated(totalEvents, msg.sender);
        return totalEvents;
    }

    function toggleCancelEvent(uint256 eventId) external
    {
        events[eventId].isCanceled = !events[eventId].isCanceled;
    }

    function buyTicket(uint256 eventId, string memory seatId, string memory _tokenURI) private returns(uint256) {
        require(events[eventId].owner != address(0), "Event does not exist");

        require(events[eventId].remainingTickets > 0, "There are no remaining tickets");
        
        // require(msg.value == events[eventId].price, "Payment did not match event ticket price");
        
        require(seatTicket[eventId][seatId] == 0, "Seat has been taken");
        
        totalTickets++;

        tickets[totalTickets] = TicketData(totalTickets, eventId, msg.sender, seatId);

        seatsTaken[eventId].push(seatId);

        seatTicket[eventId][seatId] = totalTickets;
        
        events[eventId].remainingTickets--;

        _safeMint(msg.sender, totalTickets);
        _setTokenURI(totalTickets, _tokenURI);

        ticketIds.push(totalTickets);

        return totalTickets;
    }

    function buyTickets(uint256 eventId, Token[] memory tokens) external stopInEmergency payable
    {
        require(!events[eventId].isCanceled, "Event is canceled. You cannot buy tickets for that event!");
        
        uint256[] memory ticketIdsMem = new uint256[](tokens.length);

        for(uint i = 0; i < tokens.length; i++)
        {
            uint256 id = buyTicket(eventId, tokens[i].seatId, tokens[i].tokenURI);
            ticketIdsMem[i] = id;
        }

        (bool success, ) = payable(events[eventId].owner).call{value: msg.value}("");

        require(success, "Withdrawal transfer failed.");

        emit BoughtTickets(ticketIdsMem, msg.sender);
    }

    function getAllEvents() external view returns (EventData[] memory)
    {
        EventData[] memory ret = new EventData[](eventIds.length);

        for(uint i = 0; i < eventIds.length; i++)
        {
            ret[i] = events[eventIds[i]];
        }

        return ret;
    }

    function getSeatLayout(uint256 eventId) external view returns (string memory seatsFormatURL, SeatType[] memory seatsType)
    {
        string memory seatFormat = events[eventId].seatsFormatURL;
        SeatType[] memory seatTypes = eventSeatTypes[eventId];

        return (seatFormat, seatTypes);
    }

    function getOneEvent(uint256 eventId) external view returns (EventData memory)
    {
        return events[eventId];
    }

    function getTicketBySeat(uint256 eventId, string memory seatId) external view returns (TicketData memory)
    {
        return tickets[seatTicket[eventId][seatId]];
    }

    function getTicketById(uint256 ticketId) external view returns (TicketData memory)
    {
        return tickets[ticketId];
    }

    function editEvent(
        uint256 eventId,
        string memory _name,
        string memory _datetime,
        string memory _city,
        string memory _location,
        string memory _coverURL,
        string memory _descriptionURL,
        string memory _category
    ) external returns (EventData memory)
    {
        events[eventId].name = _name;
        events[eventId].datetime = _datetime;
        events[eventId].city = _city;
        events[eventId].location = _location;
        events[eventId].coverURL = _coverURL;
        events[eventId].descriptionURL = _descriptionURL;
        events[eventId].category = _category;

        emit EventUpdated(eventId);

        return events[eventId];
    }

    function getTakenSeats(uint256 eventId) external view returns(string[] memory)
    {
        return seatsTaken[eventId];
    }

    function isValid(uint eventId, uint ticketId) external view returns (bool) {
        return tickets[ticketId].id > 0 && tickets[ticketId].eventId == eventId;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}