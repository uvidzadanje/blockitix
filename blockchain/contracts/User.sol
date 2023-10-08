// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract User {
    enum Role { CREATOR, BUYER }

    Role[] roles = [ Role.CREATOR, Role.BUYER ];

    mapping(address => UserData) users;

    address[] usersAddresses;

    struct UserData {
        address userAddress;

        Role role;
    }

    event UserCreated(address indexed user);

    modifier ValidRole(Role role) {

        for(uint i = 0; i < roles.length; i++)
        {
            if(roles[i] == role)
            {
                _;
            }
        }

        require(false, "Role is not valid!");
    }

    function create(Role role) external ValidRole(role)
    {
        users[msg.sender] = UserData(msg.sender, role);

        usersAddresses.push(msg.sender);

        emit UserCreated(msg.sender);
    }

    function getUser() external view returns(UserData memory)
    {
        return users[msg.sender];
    }
}