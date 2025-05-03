// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract QualityCheckAndPayment {
    enum QualityStatus { NotChecked, Approved, Rejected, CorrectionSubmitted }
    enum PaymentStatus { NotPaid, Paid, Withheld }

    struct RoadWork {
        string sectionName;
        QualityStatus quality;
        PaymentStatus payment;
        uint256 paymentAmount;
        uint256 inspectionDate;
        string comments;
        bool correctionRequested;
    }

    address public immutable organization;
    address payable public immutable contractor;
    RoadWork public roadWork;
    bool public fundsLocked;

    event QualityChecked(QualityStatus status, string comments);
    event CorrectionRequested(address contractor, string comments);
    event PaymentReleased(address contractor, uint256 amount);
    event PaymentWithheld(address contractor, string reason);

    modifier onlyOrganization() {
        require(msg.sender == organization, "Unauthorized: Only organization");
        _;
    }

    modifier onlyContractor() {
        require(msg.sender == contractor, "Unauthorized: Only contractor");
        _;
    }

    constructor(address payable _contractor, string memory _sectionName) payable {
        require(msg.value > 0, "Contract must be funded");
        require(_contractor != address(0), "Invalid contractor address");
        
        organization = msg.sender;
        contractor = _contractor;
        roadWork = RoadWork({
            sectionName: _sectionName,
            quality: QualityStatus.NotChecked,
            payment: PaymentStatus.NotPaid,
            paymentAmount: msg.value,
            inspectionDate: 0,
            comments: "",
            correctionRequested: false
        });
        fundsLocked = true;
    }

   function checkQuality(bool isGood, string memory _comments) public onlyOrganization {
    require(
        roadWork.quality == QualityStatus.NotChecked || 
        roadWork.quality == QualityStatus.CorrectionSubmitted,
        "Quality already finalized"
    );
    
    roadWork.quality = isGood ? QualityStatus.Approved : QualityStatus.Rejected;
    roadWork.inspectionDate = block.timestamp;
    roadWork.comments = _comments;
    roadWork.correctionRequested = false;
    
    if (isGood) {
        roadWork.payment = PaymentStatus.NotPaid;
    } else {
        roadWork.payment = PaymentStatus.Withheld;
        emit PaymentWithheld(contractor, _comments);
    }
    
    emit QualityChecked(roadWork.quality, _comments);
}

    function requestCorrection(string memory _comments) public onlyContractor {
        require(roadWork.quality == QualityStatus.Rejected, "No rejection to correct");
        require(!roadWork.correctionRequested, "Correction already requested");
        
        roadWork.quality = QualityStatus.CorrectionSubmitted;
        roadWork.correctionRequested = true;
        roadWork.comments = _comments;
        
        emit CorrectionRequested(msg.sender, _comments);
    }

    function releasePayment() public onlyOrganization {
        require(roadWork.quality == QualityStatus.Approved, "Quality not approved");
        require(roadWork.payment == PaymentStatus.NotPaid, "Payment already processed");
        require(address(this).balance >= roadWork.paymentAmount, "Insufficient funds");
        
        roadWork.payment = PaymentStatus.Paid;
        fundsLocked = false;
        contractor.transfer(roadWork.paymentAmount);
        
        emit PaymentReleased(contractor, roadWork.paymentAmount);
    }

    function getRoadStatus() public view returns (
        string memory,
        QualityStatus,
        PaymentStatus,
        uint256,
        uint256,
        string memory,
        bool
    ) {
        return (
            roadWork.sectionName,
            roadWork.quality,
            roadWork.payment,
            roadWork.paymentAmount,
            roadWork.inspectionDate,
            roadWork.comments,
            roadWork.correctionRequested
        );
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}