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
  const [contractBalance, setContractBalance] = useState("0");

  useEffect(() => {
    checkWalletConnection();
    if (wallet) {
      fetchContractData();
    }
  }, [wallet]);

  const checkWalletConnection = async () => {
    if (window.ethereum?.selectedAddress) {
      setWallet(window.ethereum.selectedAddress);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage("Please install MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      setWallet(accounts[0]);
    } catch (err) {
      setMessage(`Connection failed: ${err.message}`);
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
        quality: status[1],
        payment: status[2],
        amount: ethers.formatEther(status[3]),
        inspectionDate: new Date(Number(status[4]) * 1000).toLocaleDateString(),
        comments: status[5]
      });
      
      setContractBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Error fetching data:", err);
      setMessage("Failed to load contract data");
    }
  };

  const handleQualityCheck = async (isApproved) => {
    if (!comments.trim()) {
      setMessage("Please enter inspection comments");
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(qualityContractAddress, qualityContractABI, signer);

      const tx = await contract.checkQuality(isApproved, comments);
      await tx.wait();
      
      setMessage(`Quality ${isApproved ? "approved" : "rejected"} successfully!`);
      fetchContractData();
    } catch (err) {
      console.error(err);
      setMessage(`Error: ${err.reason || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReleasePayment = async () => {
    setIsLoading(true);
    setMessage("");
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(qualityContractAddress, qualityContractABI, signer);

      const tx = await contract.releasePayment();
      await tx.wait();
      
      setMessage("Payment released successfully!");
      fetchContractData();
    } catch (err) {
      console.error(err);
      setMessage(`Error: ${err.reason || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch(status) {
      case 0: return <span className="badge badge-gray">Not Checked</span>;
      case 1: return <span className="badge badge-green">Approved</span>;
      case 2: return <span className="badge badge-red">Rejected</span>;
      default: return <span className="badge">Unknown</span>;
    }
  };

  const renderPaymentBadge = (status) => {
    switch(status) {
      case 0: return <span className="badge badge-gray">Not Paid</span>;
      case 1: return <span className="badge badge-green">Paid</span>;
      case 2: return <span className="badge badge-orange">Withheld</span>;
      default: return <span className="badge">Unknown</span>;
    }
  };

  return (
    <div className="quality-container">
      <h2>🏗️ Road Construction Quality Control</h2>
      
      {!wallet ? (
        <button className="connect-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="wallet-info">
            Connected as: <span>{wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
          </div>

          {projectStatus && (
            <div className="project-card">
              <h3>{projectStatus.sectionName}</h3>
              <div className="status-grid">
                <div>
                  <strong>Quality Status:</strong>
                  {renderStatusBadge(projectStatus.quality)}
                </div>
                <div>
                  <strong>Payment Status:</strong>
                  {renderPaymentBadge(projectStatus.payment)}
                </div>
                <div>
                  <strong>Contract Value:</strong>
                  {projectStatus.amount} ETH
                </div>
                <div>
                  <strong>Remaining Balance:</strong>
                  {contractBalance} ETH
                </div>
                {projectStatus.inspectionDate !== "1/1/1970" && (
                  <div>
                    <strong>Last Inspection:</strong>
                    {projectStatus.inspectionDate}
                  </div>
                )}
              </div>
              
              {projectStatus.comments && (
                <div className="comments-section">
                  <h4>Inspection Notes</h4>
                  <p>{projectStatus.comments}</p>
                </div>
              )}
            </div>
          )}

          <div className="action-panel">
            <h3>Quality Inspection</h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter inspection comments..."
              className="comments-input"
            />
            
            <div className="button-group">
              <button 
                onClick={() => handleQualityCheck(true)} 
                disabled={isLoading}
                className="btn-approve"
              >
                {isLoading ? "Processing..." : "Approve Quality ✅"}
              </button>
              <button 
                onClick={() => handleQualityCheck(false)} 
                disabled={isLoading}
                className="btn-reject"
              >
                {isLoading ? "Processing..." : "Reject Quality ❌"}
              </button>
            </div>

            {projectStatus?.quality === 1 && projectStatus.payment === 0 && (
              <button 
                onClick={handleReleasePayment} 
                disabled={isLoading}
                className="btn-pay"
              >
                {isLoading ? "Processing..." : "Release Payment 💰"}
              </button>
            )}
          </div>
        </>
      )}

      {message && (
        <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default QualityCheck;