// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Remove OpenZeppelin import since we're not using Strings utility
contract QualityCheckAndPayment {
    enum QualityStatus { NotChecked, Approved, Rejected, CorrectionSubmitted, Disputed }
    enum InspectionStage { First, Second, Third, Completed }

    struct InspectionChecklist {
        bool materialQuality;
        bool safetyCompliance;
        bool designSpecs;
        bool environmentalImpact;
    }

    struct RoadWork {
        string sectionName;
        QualityStatus quality;
        uint256 totalAmount;
        uint256 amountReleased;
        uint256 inspectionDate;
        string comments;
        bool correctionRequested;
        InspectionStage currentStage;
        address[3] inspectors;
        InspectionChecklist checklist;
        address disputingParty;
        string disputeReason;
    }

    address public immutable organization;
    address payable public immutable contractor;
    RoadWork public roadWork;
    uint256 public disputeEndTime;

    event QualityChecked(uint256 stage, QualityStatus status, string comments);
    event CorrectionRequested(address contractor, string comments);
    event PaymentReleased(address contractor, uint256 amount, uint256 stage);
    event DisputeInitiated(address party, string reason);
    event DisputeResolved(bool contractorWon);
    event NotificationSent(address recipient, string message);
    event PaymentWithheld(address contractor, string reason);

    modifier onlyOrganization() { 
        require(msg.sender == organization, "Unauthorized"); 
        _; 
    }
    
    modifier onlyContractor() { 
        require(msg.sender == contractor, "Unauthorized"); 
        _; 
    }
    
    modifier onlyCurrentStageInspector() {
        require(
            msg.sender == roadWork.inspectors[uint256(roadWork.currentStage)], 
            "Only current stage inspector"
        );
        _;
    }
    
    modifier noActiveDispute() { 
        require(roadWork.quality != QualityStatus.Disputed, "Dispute active"); 
        _; 
    }

    constructor(
        address payable _contractor, 
        string memory _sectionName, 
        address[3] memory _inspectors
    ) payable {
        require(msg.value > 0, "Contract must be funded");
        require(_contractor != address(0), "Invalid contractor address");
        
        organization = msg.sender;
        contractor = _contractor;
        roadWork = RoadWork({
            sectionName: _sectionName,
            quality: QualityStatus.NotChecked,
            totalAmount: msg.value,
            amountReleased: 0,
            inspectionDate: 0,
            comments: "",
            correctionRequested: false,
            currentStage: InspectionStage.First,
            inspectors: _inspectors,
            checklist: InspectionChecklist(false, false, false, false),
            disputingParty: address(0),
            disputeReason: ""
        });
    }

    function checkQuality(
        InspectionChecklist memory _checklist, 
        string memory _comments
    ) public onlyCurrentStageInspector noActiveDispute {
        require(
            roadWork.quality == QualityStatus.NotChecked || 
            roadWork.quality == QualityStatus.CorrectionSubmitted,
            "Quality already finalized"
        );

        bool isGood = _checklist.materialQuality && 
                     _checklist.safetyCompliance && 
                     _checklist.designSpecs && 
                     _checklist.environmentalImpact;

        roadWork.quality = isGood ? QualityStatus.Approved : QualityStatus.Rejected;
        roadWork.checklist = _checklist;
        roadWork.inspectionDate = block.timestamp;
        roadWork.comments = _comments;

        if (isGood) {
            _processApproval();
        } else {
            roadWork.correctionRequested = true;
            emit PaymentWithheld(contractor, _comments);
        }

        emit QualityChecked(uint256(roadWork.currentStage), roadWork.quality, _comments);
    }

    function submitCorrection(string memory _comments) public onlyContractor {
        require(roadWork.quality == QualityStatus.Rejected, "No rejection to correct");
        require(roadWork.correctionRequested, "Correction not requested");
        
        roadWork.quality = QualityStatus.CorrectionSubmitted;
        roadWork.comments = _comments;
        emit CorrectionRequested(msg.sender, _comments);
    }

    function _processApproval() private {
        uint256 paymentAmount;
        
        if (roadWork.currentStage == InspectionStage.First) {
            paymentAmount = roadWork.totalAmount * 25 / 100;
            roadWork.currentStage = InspectionStage.Second;
        } 
        else if (roadWork.currentStage == InspectionStage.Second) {
            paymentAmount = roadWork.totalAmount * 25 / 100;
            roadWork.currentStage = InspectionStage.Third;
        } 
        else {
            paymentAmount = roadWork.totalAmount - roadWork.amountReleased;
            roadWork.currentStage = InspectionStage.Completed;
        }

        roadWork.amountReleased += paymentAmount;
        (bool success, ) = contractor.call{value: paymentAmount}("");
        require(success, "Payment transfer failed");
        
        emit PaymentReleased(contractor, paymentAmount, uint256(roadWork.currentStage));
        
        // Convert stage to string without OpenZeppelin
        string memory stageName;
        if (roadWork.currentStage == InspectionStage.First) stageName = "First";
        else if (roadWork.currentStage == InspectionStage.Second) stageName = "Second";
        else if (roadWork.currentStage == InspectionStage.Third) stageName = "Third";
        else stageName = "Final";
        
        emit NotificationSent(
            contractor, 
            string(abi.encodePacked(stageName, " stage approved. Payment released."))
        );
        
        roadWork.quality = QualityStatus.NotChecked;
        roadWork.correctionRequested = false;
    }

    function initiateDispute(string memory _reason) public {
        require(
            msg.sender == contractor || 
            msg.sender == organization, 
            "Unauthorized"
        );
        require(
            roadWork.quality != QualityStatus.Disputed, 
            "Dispute already active"
        );
        
        roadWork.quality = QualityStatus.Disputed;
        roadWork.disputingParty = msg.sender;
        roadWork.disputeReason = _reason;
        disputeEndTime = block.timestamp + 7 days;
        
        emit DisputeInitiated(msg.sender, _reason);
    }

    function resolveDispute(bool contractorWon) public onlyOrganization {
        require(
            roadWork.quality == QualityStatus.Disputed, 
            "No active dispute"
        );
        require(
            block.timestamp <= disputeEndTime,
            "Dispute period expired"
        );
        
        roadWork.quality = contractorWon ? QualityStatus.Approved : QualityStatus.Rejected;
        if (contractorWon) _processApproval();
        
        emit DisputeResolved(contractorWon);
    }

    function getRoadStatus() public view returns (
        string memory,
        QualityStatus,
        uint256,
        uint256,
        uint256,
        string memory,
        bool,
        InspectionStage,
        address[3] memory,
        InspectionChecklist memory,
        address,
        string memory
    ) {
        return (
            roadWork.sectionName,
            roadWork.quality,
            roadWork.totalAmount,
            roadWork.amountReleased,
            roadWork.inspectionDate,
            roadWork.comments,
            roadWork.correctionRequested,
            roadWork.currentStage,
            roadWork.inspectors,
            roadWork.checklist,
            roadWork.disputingParty,
            roadWork.disputeReason
        );
    }

    receive() external payable {
        revert("Direct payments not allowed");
    }
}