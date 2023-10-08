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

        uint price;

        uint totalTickets;

        uint remainingTickets;

        address owner;

        string date;

        string time;

        string location;
    }

    mapping(uint256 => uint[]) seatsTaken;

    mapping(uint256 => mapping(uint => uint256)) seatTicket;

    struct TicketData {
        uint256 id;

        uint256 eventId;

        bool redeemed;

        address owner;
    }
    
    uint256 totalEvents;
    uint256 totalTickets;

    mapping(uint256 => EventData) events;
    uint256[] eventIds;

    mapping(uint256 => TicketData) tickets;
    uint256[] ticketIds;

    event EventCreated(uint indexed eventId, address indexed creator);

    event BoughtTicket(uint indexed ticketId, uint indexed seat, address indexed buyer);

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
        uint _price, 
        uint _totalTickets,
        string memory _date,
        string memory _time,
        string memory _location
        ) external stopInEmergency returns (uint) {
        totalEvents++;
        events[totalEvents] = EventData(totalEvents, _name, _price, _totalTickets, _totalTickets, msg.sender, _date, _time, _location);
        eventIds.push(totalEvents);
        emit EventCreated(totalEvents, msg.sender);
        return totalEvents;
    }

    function deleteEvent(uint256 eventId) external
    {
        delete events[eventId];
    }

    receive() external payable {}

    function buyTicket(uint256 eventId, uint seatNumber) external stopInEmergency payable {
        require(events[eventId].owner != address(0), "Event does not exist");

        require(events[eventId].remainingTickets > 0, "There are no remaining tickets");
        
        require(msg.value == events[eventId].price, "Payment did not match event ticket price");
        
        require(seatTicket[eventId][seatNumber] == 0, "Seat has been taken");
        
        totalTickets++;

        tickets[totalTickets] = TicketData(totalTickets, eventId, false, msg.sender);

        seatsTaken[eventId].push(seatNumber);

        seatTicket[eventId][seatNumber] = totalTickets;
        
        events[eventId].remainingTickets--;

        _safeMint(msg.sender, totalTickets);

        (bool success, ) = payable(events[eventId].owner).call{value: msg.value}("");

        require(success, "Withdrawal transfer failed.");

        ticketIds.push(totalTickets);

        emit BoughtTicket(totalTickets, seatNumber, msg.sender);
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

    function getOneEvent(uint256 eventId) external view returns (EventData memory)
    {
        return events[eventId];
    }

    function getTIcketBySeat(uint256 eventId, uint seatNumber) external view returns (TicketData memory)
    {
        return tickets[seatTicket[eventId][seatNumber]];
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

    function getTakenSeats(uint256 eventId) external view returns(uint[] memory)
    {
        return seatsTaken[eventId];
    }

    function isValid(uint eventId, uint ticketId) external view returns (bool) {
        return tickets[ticketId].id > 0 && tickets[ticketId].eventId == eventId;
    }
}