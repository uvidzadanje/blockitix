// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract Blockitix is Ownable, ERC721 {
    bool private stopped = false;

    struct EventData {
        uint256 id;

        string name;

        uint totalTickets;

        uint remainingTickets;

        string seatsFormat;

        address owner;

        string date;

        string time;

        string location;

        bool isCanceled;

        string coverURL;
    }

    mapping(uint256 => SeatType[]) eventSeatTypes;

    // mapping(uint256 => uint[]) seatsTaken;

    // seatIdFormat: layoutName;row;column

    // eventId => seatIdFormat 
    mapping(uint256 => string[]) seatsTaken;

    // eventId => seatIdFormat => ticketId
    mapping(uint256 => mapping (string => uint256)) seatTicket;

    struct TicketData {
        uint256 id;

        uint256 eventId;

        address owner;
    }

    struct SeatType {
        string name;

        string colorMark;

        uint price;
    }
    
    uint256 totalEvents;
    uint256 totalTickets;

    mapping(uint256 => EventData) events;
    uint256[] eventIds;

    mapping(uint256 => TicketData) tickets;
    uint256[] ticketIds;

    event EventCreated(uint indexed eventId, address indexed creator);

    event BoughtTicket(uint indexed ticketId, address indexed buyer);

    event RedeemedTicket(uint indexed ticketId);

    modifier stopInEmergency() {
        require(!stopped, "Contract is in emergency stop");
        _;
    }
    
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        
    }

    function toggleEmergencyStop() public onlyOwner {
        stopped = !stopped;
    }

    function createEvent(
        string memory _name,
        uint _totalTickets,
        string memory _seatFormat,
        string memory _date,
        string memory _time,
        string memory _location,
        string memory _coverURL,
        SeatType[] memory _seatTypes
        ) external stopInEmergency returns (uint) {
            
        totalEvents++;
        events[totalEvents] = EventData(totalEvents, _name, _totalTickets, _totalTickets, _seatFormat, msg.sender, _date, _time, _location, false, _coverURL);
        eventIds.push(totalEvents);

        uint256 seatTypesLength = _seatTypes.length;
        for (uint i = 0; i < seatTypesLength; i++) {
            eventSeatTypes[totalEvents].push(_seatTypes[i]);
        }

        emit EventCreated(totalEvents, msg.sender);
        return totalEvents;
    }

    function cancelEvent(uint256 eventId) external
    {
        events[eventId].isCanceled = true;
    }

    function buyTicket(uint256 eventId, string memory seatId) external stopInEmergency payable {
        require(events[eventId].owner != address(0), "Event does not exist");

        require(events[eventId].remainingTickets > 0, "There are no remaining tickets");
        
        // require(msg.value == events[eventId].price, "Payment did not match event ticket price");
        
        require(seatTicket[eventId][seatId] == 0, "Seat has been taken");
        
        totalTickets++;

        tickets[totalTickets] = TicketData(totalTickets, eventId, msg.sender);

        seatsTaken[eventId].push(seatId);

        seatTicket[eventId][seatId] = totalTickets;
        
        events[eventId].remainingTickets--;

        _safeMint(msg.sender, totalTickets);

        (bool success, ) = payable(events[eventId].owner).call{value: msg.value}("");

        require(success, "Withdrawal transfer failed.");

        ticketIds.push(totalTickets);

        emit BoughtTicket(totalTickets, msg.sender);
    }

    function getAllEvents() external view returns (EventData[] memory)
    {
        EventData[] memory ret = new EventData[](eventIds.length);

        for(uint i = 0; i < eventIds.length; i++)
        {
            ret[i] = events[eventIds[i]];
            ret[i].seatsFormat = "";
        }

        return ret;
    }

    function getSeatLayout(uint256 eventId) external view returns (string memory seatsFormat, SeatType[] memory seatsType)
    {
        string memory seatFormat = events[eventId].seatsFormat;
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

    function editEventDate(uint256 eventId, string memory date, string memory time) external
    {
        events[eventId].date = date;
        events[eventId].time = time;
    }

    function editEventLocation(uint256 eventId, string memory location) external
    {
        events[eventId].location = location;
    }

    // function redeemTicket(uint ticketId, uint eventId) external stopInEmergency {
    //     address owner = events[eventId].owner;
    //     require(owner > address(0), "The event does not exist");

    //     require(msg.sender == owner, "Sender must be the owner of the event");

    //     // events[eventId][ticketId] = msg.sender;

    //     emit RedeemedTicket(ticketId);
    // }

    function getTakenSeats(uint256 eventId) external view returns(string[] memory)
    {
        return seatsTaken[eventId];
    }

    function isValid(uint eventId, uint ticketId) external view returns (bool) {
        return tickets[ticketId].id > 0 && tickets[ticketId].eventId == eventId;
    }
}