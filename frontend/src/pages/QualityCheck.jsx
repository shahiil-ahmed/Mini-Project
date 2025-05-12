import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, ethers } from 'ethers';
import { qualityContractAddress, qualityContractABI } from '../contractConfig';
import './QualityCheck.css';

const QualityCheck = () => {
    const [status, setStatus] = useState(null);
    const [inspectionComments, setInspectionComments] = useState('');
    const [correctionDetails, setCorrectionDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState('');
    const [currentAccount, setCurrentAccount] = useState('');
    const [isContractorAccount, setIsContractorAccount] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum?.selectedAddress) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                setCurrentAccount(accounts[0]);
                await fetchContractData();
            }
        };
        init();

        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                fetchContractData();
            }
        };

        window.ethereum?.on('accountsChanged', handleAccountsChanged);
        return () => window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    }, []);

    useEffect(() => {
        const checkContractor = async () => {
            if (currentAccount) {
                const isContractorRes = await isContractor();
                setIsContractorAccount(isContractorRes);
            }
        };
        checkContractor();
    }, [currentAccount, status]);

    const fetchContractData = async () => {
        try {
            setIsLoading(true);
            const provider = new BrowserProvider(window.ethereum);
            const contract = new Contract(qualityContractAddress, qualityContractABI, provider);
            const result = await contract.getRoadStatus();

            const defaultInspectors = ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000'];

            const inspectors = result[5]?.length === 3
                ? result[5]
                : result[5]?.length > 3
                ? result[5].slice(0, 3)
                : defaultInspectors;

            setStatus({
                sectionName: result[0],
                quality: Number(result[1]),
                totalAmount: ethers.formatEther(result[2]),
                amountReleased: ethers.formatEther(result[3]),
                currentStage: Number(result[4]),
                inspectors: inspectors,
                checklist: result[6],
                comments: result[7],
                correctionRequested: result[8]
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            setNotification(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const isCurrentInspector = () => {
        if (!status || !currentAccount || status.currentStage === 3) return false;
        const currentInspector = status.inspectors[status.currentStage]?.toLowerCase();
        return currentInspector && currentAccount.toLowerCase() === currentInspector;
    };

    const isContractor = async () => {
        if (!status || !currentAccount) return false;
        try {
            const provider = new BrowserProvider(window.ethereum);
            const contract = new Contract(qualityContractAddress, qualityContractABI, provider);
            const contractorAddr = await contract.contractor();
            return currentAccount.toLowerCase() === contractorAddr.toLowerCase();
        } catch {
            return false;
        }
    };

    const handleQualityCheck = async (approved) => {
        try {
            setIsLoading(true);
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(qualityContractAddress, qualityContractABI, signer);

            const tx = await contract.checkQuality(
                {
                    materialQuality: approved,
                    safetyCompliance: approved,
                    designSpecs: approved,
                    environmentalImpact: approved
                },
                inspectionComments
            );
            await tx.wait();

            setNotification(`✅ Quality ${approved ? "approved" : "rejected"}`);
            setInspectionComments('');
            await fetchContractData();
        } catch (error) {
            console.error("Transaction failed:", error);
            setNotification(`❌ Error: ${error.reason || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitCorrection = async () => {
        try {
            setIsLoading(true);
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(qualityContractAddress, qualityContractABI, signer);

            const tx = await contract.submitCorrection(correctionDetails);
            await tx.wait();

            setNotification("✅ Correction submitted");
            setCorrectionDetails('');
            await fetchContractData();
        } catch (error) {
            console.error("Correction failed:", error);
            setNotification(`❌ Error: ${error.reason || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderInspectorActions = () => {
        if (status.currentStage === 3) return null;
        if (!isCurrentInspector()) return null;
        if (status.quality !== 0 && status.quality !== 3) return null;

        return (
            <div className="inspector-actions">
                <h4>Stage {status.currentStage + 1} Inspection</h4>
                <div className="payment-details">
                    Amount to release: {["25%", "25%", "50%"][status.currentStage]}
                </div>
                <textarea
                    value={inspectionComments}
                    onChange={(e) => setInspectionComments(e.target.value)}
                    placeholder="Enter inspection comments..."
                    disabled={isLoading}
                />
                <div className="button-group">
                    <button 
                        onClick={() => handleQualityCheck(true)}
                        disabled={isLoading}
                        className="approve-btn"
                    >
                        Approve
                    </button>
                    <button 
                        onClick={() => handleQualityCheck(false)}
                        disabled={isLoading}
                        className="reject-btn"
                    >
                        Reject
                    </button>
                </div>
            </div>
        );
    };

    const renderCorrectionForm = () => {
        if (status.quality !== 2) return null;
        if (!isContractorAccount) return null;

        return (
            <div className="correction-panel">
                <h4>Submit Correction</h4>
                <div className="rejection-reason">
                    <strong>Rejection Reason:</strong> {status.comments}
                </div>
                <textarea
                    value={correctionDetails}
                    onChange={(e) => setCorrectionDetails(e.target.value)}
                    placeholder="Describe your corrections..."
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSubmitCorrection}
                    disabled={isLoading || !correctionDetails.trim()}
                    className="correction-btn"
                >
                    {isLoading ? "Submitting..." : "Submit Correction"}
                </button>
            </div>
        );
    };

    const getStageName = () => {
        return ["First", "Second", "Final", "Completed"][status.currentStage] || "Unknown";
    };

    const getStatusText = () => {
        return ["Not Checked", "Approved", "Rejected", "Correction Submitted"][status.quality] || "Unknown";
    };

    return (
        <div className="quality-container">
            <h2>🏗️ Construction Quality Control</h2>
            
            {notification && (
                <div className={`notification ${notification.includes("✅") ? "success" : "error"}`}>
                    {notification}
                </div>
            )}

            {status ? (
                <>
                    <div className="status-card">
                        <h3>{status.sectionName}</h3>
                        <div className="status-grid">
                            <div><strong>Stage:</strong> {getStageName()}</div>
                            <div><strong>Status:</strong> {getStatusText()}</div>
                            <div><strong>Total:</strong> {status.totalAmount} ETH</div>
                            <div><strong>Released:</strong> {status.amountReleased} ETH</div>
                            {status.currentStage === 3 && (
                                <div className="completion-badge">
                                    <span className="badge-green">Project Completed</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {renderInspectorActions()}
                    {renderCorrectionForm()}

                    {status.currentStage === 3 && (
                        <div className="completion-message">
                            <h4>🎉 Project Successfully Completed!</h4>
                            <p>All inspections passed and payments released.</p>
                            <p>Final amount released: {status.amountReleased} ETH</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="loading-spinner">Loading project data...</div>
            )}
        </div>
    );
};

export default QualityCheck;
