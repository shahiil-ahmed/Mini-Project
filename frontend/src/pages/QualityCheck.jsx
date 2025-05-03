import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { qualityContractAddress, qualityContractABI } from "../contractConfig";
import "./QualityCheck.css";

const QualityCheck = () => {
  const [wallet, setWallet] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectStatus, setProjectStatus] = useState(null);
  const [comments, setComments] = useState("");
  const [correctionComments, setCorrectionComments] = useState("");
  const [contractBalance, setContractBalance] = useState("0");

  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      setWallet(window.ethereum.selectedAddress);
      fetchContractData();
    }
  }, [wallet]);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(accounts[0]);
    } catch (err) {
      setMessage(`Wallet connection failed: ${err.message}`);
    }
  };

  const fetchContractData = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(qualityContractAddress, qualityContractABI, provider);

      const status = await contract.getRoadStatus();
      const balance = await contract.contractBalance();

      setProjectStatus({
        sectionName: status[0],
        quality: Number(status[1]),
        payment: Number(status[2]),
        amount: ethers.formatEther(status[3]),
        inspectionDate: status[4] > 0 ? new Date(Number(status[4]) * 1000).toLocaleDateString() : "",
        comments: status[5],
        correctionRequested: status[6]
      });

      setContractBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Error fetching contract data.");
    }
  };

  const handleQualityCheck = async (isApproved) => {
    if (!comments.trim()) {
      setMessage("Enter inspection comments.");
      return;
    }

    try {
      setIsLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(qualityContractAddress, qualityContractABI, signer);

      const tx = await contract.checkQuality(isApproved, comments);
      await tx.wait();

      setMessage(`✅ Quality ${isApproved ? "approved" : "rejected"}`);
      setComments("");
      fetchContractData();
    } catch (err) {
      console.error("Quality check error:", err);
      setMessage(`Error: ${err.reason || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorrectionRequest = async () => {
    if (!correctionComments.trim()) {
      setMessage("Enter correction details.");
      return;
    }

    try {
      setIsLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(qualityContractAddress, qualityContractABI, signer);

      const tx = await contract.requestCorrection(correctionComments);
      await tx.wait();

      setMessage("✅ Correction submitted.");
      setCorrectionComments("");
      fetchContractData();
    } catch (err) {
      console.error("Correction error:", err);
      setMessage(`Error: ${err.reason || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReleasePayment = async () => {
    try {
      setIsLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(qualityContractAddress, qualityContractABI, signer);

      const tx = await contract.releasePayment();
      await tx.wait();

      setMessage("💰 Payment released successfully.");
      fetchContractData();
    } catch (err) {
      console.error("Payment error:", err);
      setMessage(`Error: ${err.reason || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBadge = (value, labels, classes) => {
    return <span className={`badge ${classes[value] || "badge-gray"}`}>{labels[value] || "Unknown"}</span>;
  };

  return (
    <div className="quality-container">
      <h2>🏗️ Road Construction Quality Control</h2>

      {!wallet ? (
        <button className="connect-btn" onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <div className="wallet-info">Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}</div>

          {projectStatus && (
            <>
              <div className="project-card">
                <h3>{projectStatus.sectionName}</h3>
                <div className="status-grid">
                  <div><strong>Quality:</strong> {renderBadge(projectStatus.quality, ["Not Checked", "Approved", "Rejected", "Correction Submitted"], ["badge-gray", "badge-green", "badge-red", "badge-blue"])}</div>
                  <div><strong>Payment:</strong> {renderBadge(projectStatus.payment, ["Not Paid", "Paid", "Withheld"], ["badge-gray", "badge-green", "badge-orange"])}</div>
                  <div><strong>Contract Value:</strong> {projectStatus.amount} ETH</div>
                  <div><strong>Balance:</strong> {contractBalance} ETH</div>
                  {projectStatus.inspectionDate && <div><strong>Last Inspection:</strong> {projectStatus.inspectionDate}</div>}
                </div>

                {projectStatus.comments && (
                  <div className="comments-section">
                    <h4>Inspection Comments</h4>
                    <p>{projectStatus.comments}</p>
                  </div>
                )}

                {projectStatus.quality === 2 && !projectStatus.correctionRequested && (
                  <div className="correction-panel">
                    <textarea
                      value={correctionComments}
                      onChange={(e) => setCorrectionComments(e.target.value)}
                      placeholder="Correction details..."
                      className="comments-input"
                    />
                    <button onClick={handleCorrectionRequest} disabled={isLoading} className="btn-correct">
                      {isLoading ? "Processing..." : "Submit Correction"}
                    </button>
                  </div>
                )}
              </div>

              <div className="action-panel">
                <h3>Inspector Actions</h3>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Inspection comments..."
                  className="comments-input"
                />
                <div className="button-group">
                  <button
                    onClick={() => handleQualityCheck(true)}
                    disabled={isLoading || !(projectStatus.quality === 0 || projectStatus.quality === 3)}
                    className="btn-approve"
                  >
                    Approve ✅
                  </button>
                  <button
                    onClick={() => handleQualityCheck(false)}
                    disabled={isLoading || !(projectStatus.quality === 0 || projectStatus.quality === 3)}
                    className="btn-reject"
                  >
                    Reject ❌
                  </button>
                </div>
              </div>

              {projectStatus.quality === 1 && projectStatus.payment !== 1 && (  // Changed condition
                <button className="btn-pay" onClick={handleReleasePayment} disabled={isLoading}>
                  {isLoading ? "Processing..." : "Release Payment 💸"}
                </button>
              )}
            </>
          )}

          {message && (
            <div className={`message ${message.includes("✅") || message.includes("successfully") ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QualityCheck;
