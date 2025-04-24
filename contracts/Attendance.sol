// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Attendance {
    struct DailyRecord {
        bool morning;
        bool evening;
        uint date;
    }

    bytes32 constant MORNING = keccak256("morning");
    bytes32 constant EVENING = keccak256("evening");
    
    address public contractor;
    mapping(uint => mapping(uint => DailyRecord)) public attendance; // workerId => date => record
    
    event AttendanceMarked(
        uint indexed workerId, 
        bytes32 session, 
        address markedBy, 
        uint timestamp
    );

    constructor() {
        contractor = msg.sender;
    }

    modifier onlyContractor() {
        require(msg.sender == contractor, "Only contractor can mark attendance");
        _;
    }

    function markAttendance(uint workerId, bytes32 session) public onlyContractor {
        uint today = block.timestamp / 1 days * 1 days; // Normalize to day start
        DailyRecord storage record = attendance[workerId][today];
        
        if (session == MORNING) {
            require(!record.morning, "Attendance already marked for morning");
            record.morning = true;
        } else if (session == EVENING) {
            require(!record.evening, "Attendance already marked for evening");
            record.evening = true;
        } else {
            revert("Invalid session");
        }
        
        record.date = today;
        emit AttendanceMarked(workerId, session, msg.sender, block.timestamp);
    }

    function getAttendance(uint workerId, uint date) public view returns (bool morning, bool evening) {
        DailyRecord memory record = attendance[workerId][date];
        return (record.morning, record.evening);
    }
}