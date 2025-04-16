// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Attendance {
    address public contractor;

    struct AttendanceData {
        bool morningCheckedIn;
        bool eveningCheckedIn;
    }

    mapping(address => bool) public isRegistered;
    mapping(address => mapping(uint256 => AttendanceData)) public attendance;
    mapping(address => uint256) public totalDaysPresent;

    event WorkerRegistered(address worker);
    event AttendanceMarked(address worker, uint256 date, string session);
    event DayCompleted(address worker, uint256 date);

    modifier onlyContractor() {
        require(msg.sender == contractor, "Only contractor can perform this action");
        _;
    }

    modifier onlyWorker() {
        require(isRegistered[msg.sender], "You are not a registered worker");
        _;
    }

    constructor() {
        contractor = msg.sender;
    }

    function registerWorker(address _worker) external onlyContractor {
        require(!isRegistered[_worker], "Already registered");
        isRegistered[_worker] = true;
        emit WorkerRegistered(_worker);
    }

    function markAttendance(uint256 _date, string memory _session) external onlyWorker {
        AttendanceData storage record = attendance[msg.sender][_date];

        if (keccak256(abi.encodePacked(_session)) == keccak256(abi.encodePacked("morning"))) {
            require(!record.morningCheckedIn, "Already marked morning");
            record.morningCheckedIn = true;
        } else if (keccak256(abi.encodePacked(_session)) == keccak256(abi.encodePacked("evening"))) {
            require(!record.eveningCheckedIn, "Already marked evening");
            record.eveningCheckedIn = true;
        } else {
            revert("Invalid session");
        }

        emit AttendanceMarked(msg.sender, _date, _session);

        if (record.morningCheckedIn && record.eveningCheckedIn) {
            totalDaysPresent[msg.sender]++;
            emit DayCompleted(msg.sender, _date);
        }
    }
}
