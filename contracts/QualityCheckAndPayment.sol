// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract QualityCheckAndPayment {
    enum QualityStatus { NotChecked, Approved, Rejected, CorrectionSubmitted }
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
        InspectionStage currentStage;
        address[3] inspectors;
        InspectionChecklist checklist;
        string comments;
        bool correctionRequested;
    }

    address public immutable organization;
    address payable public immutable contractor;
    RoadWork public roadWork;

    event QualityChecked(uint256 stage, QualityStatus status, string comments);
    event PaymentReleased(address contractor, uint256 amount, uint256 stage);

    modifier onlyCurrentStageInspector() {
        require(msg.sender == roadWork.inspectors[uint256(roadWork.currentStage)], "Not current inspector");
        _;
    }

    constructor(
        address payable _contractor,
        string memory _sectionName,
        address[3] memory _inspectors
    ) payable {
        require(msg.value > 0, "Funding required");
        organization = msg.sender;
        contractor = _contractor;
        roadWork = RoadWork({
            sectionName: _sectionName,
            quality: QualityStatus.NotChecked,
            totalAmount: msg.value,
            amountReleased: 0,
            currentStage: InspectionStage.First,
            inspectors: _inspectors,
            checklist: InspectionChecklist(false, false, false, false),
            comments: "",
            correctionRequested: false
        });
    }

    function checkQuality(
        InspectionChecklist memory _checklist,
        string memory _comments
    ) external onlyCurrentStageInspector {
        require(
            roadWork.quality == QualityStatus.NotChecked || 
            roadWork.quality == QualityStatus.CorrectionSubmitted,
            "Action already taken"
        );

        bool approved = _checklist.materialQuality &&
                       _checklist.safetyCompliance &&
                       _checklist.designSpecs &&
                       _checklist.environmentalImpact;

        roadWork.quality = approved ? QualityStatus.Approved : QualityStatus.Rejected;
        roadWork.checklist = _checklist;
        roadWork.comments = _comments;
        roadWork.correctionRequested = !approved;

        if (approved) {
            _releasePayment();
        }

        emit QualityChecked(uint256(roadWork.currentStage), roadWork.quality, _comments);
    }

    function submitCorrection(string memory _comments) external {
        require(msg.sender == contractor, "Only contractor");
        require(roadWork.quality == QualityStatus.Rejected, "Not rejected");
        
        roadWork.quality = QualityStatus.CorrectionSubmitted;
        roadWork.comments = _comments;
    }

    function _releasePayment() private {
        uint256 amount;
        if (roadWork.currentStage == InspectionStage.First) {
            amount = roadWork.totalAmount * 25 / 100;
            roadWork.currentStage = InspectionStage.Second;
        } else if (roadWork.currentStage == InspectionStage.Second) {
            amount = roadWork.totalAmount * 25 / 100;
            roadWork.currentStage = InspectionStage.Third;
        } else {
            amount = roadWork.totalAmount - roadWork.amountReleased;
            roadWork.currentStage = InspectionStage.Completed;
        }

        roadWork.amountReleased += amount;
        (bool sent, ) = contractor.call{value: amount}("");
        require(sent, "Payment failed");
        
        // Reset for next stage
        if (roadWork.currentStage != InspectionStage.Completed) {
            roadWork.quality = QualityStatus.NotChecked;
        }

        emit PaymentReleased(contractor, amount, uint256(roadWork.currentStage));
    }

    function getRoadStatus() external view returns (
        string memory,
        QualityStatus,
        uint256,
        uint256,
        InspectionStage,
        address[3] memory,
        InspectionChecklist memory,
        string memory,
        bool
    ) {
        return (
            roadWork.sectionName,
            roadWork.quality,
            roadWork.totalAmount,
            roadWork.amountReleased,
            roadWork.currentStage,
            roadWork.inspectors,
            roadWork.checklist,
            roadWork.comments,
            roadWork.correctionRequested
        );
    }
}