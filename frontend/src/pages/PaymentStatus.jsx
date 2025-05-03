import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { qualityContractAddress, qualityContractABI } from "../contractConfig";
import "./PaymentStatus.css";

const PaymentStatus = () => {
  const [wallet, setWallet] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [roadStatus, setRoadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contractBalance, setContractBalance] = useState("0");

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum?.selectedAddress) {
        setWallet(window.ethereum.selectedAddress);
        await fetchContractData();
      }
    };
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage({ text: "Please install MetaMask!", type: "error" });
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setWallet(accounts[0]);
      await fetchContractData();
    } catch (err) {
      setMessage({ text: `Connection failed: ${err.message}`, type: "error" });
    }
  };

  const fetchContractData = async () => {
    try {
      setIsLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(qualityContractAddress, qualityContractABI, provider);

      const status = await contract.getRoadStatus();
      const balance = await contract.contractBalance();

      setRoadStatus({
        sectionName: status[0],
        quality: Number(status[1]),
        payment: Number(status[2]),
        amount: ethers.formatEther(status[3]),
        inspectionDate: new Date(Number(status[4]) * 1000),
        comments: status[5],
        correctionRequested: status[6]
      });

      setContractBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Error fetching data:", err);
      setMessage({ text: "Failed to load contract data", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const releasePayment = async () => {
    try {
      setIsLoading(true);
      setMessage({ text: "", type: "" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(qualityContractAddress, qualityContractABI, signer);

      const tx = await contract.releasePayment();
      await tx.wait();

      setMessage({
        text: `✅ Successfully released ${roadStatus.amount} ETH to contractor`,
        type: "success"
      });
      await fetchContractData();
    } catch (err) {
      console.error("Payment release error:", err);
      setMessage({
        text: `Failed: ${err.reason || err.message}`,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 0: return <span className="badge badge-gray">Not Checked</span>;
      case 1: return <span className="badge badge-green">Approved</span>;
      case 2: return <span className="badge badge-red">Rejected</span>;
      case 3: return <span className="badge badge-blue">Correction Submitted</span>;
      default: return <span className="badge">Unknown</span>;
    }
  };

  const renderPaymentBadge = (status) => {
    switch (status) {
      case 0: return <span className="badge badge-gray">Not Paid</span>;
      case 1: return <span className="badge badge-green">Paid</span>;
      case 2: return <span className="badge badge-orange">Withheld</span>;
      default: return <span className="badge">Unknown</span>;
    }
  };

  const canReleasePayment = () => {
    if (!roadStatus) return false;
    return (
        roadStatus.quality === 1 &&  // Quality is approved
        roadStatus.payment !== 1 &&  // Payment is not already paid
        parseFloat(contractBalance) >= parseFloat(roadStatus.amount)
    );
};

  return (
    <div className="payment-container">
      <h2>💰 Payment Management</h2>

      {!wallet ? (
        <button className="connect-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="wallet-info">
            Connected as: <span>{wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
          </div>

          {isLoading ? (
            <div className="loading">Loading contract data...</div>
          ) : roadStatus ? (
            <div className="payment-card">
              <h3>{roadStatus.sectionName}</h3>

              <div className="status-grid">
                <div>
                  <strong>Quality Status:</strong>
                  {renderStatusBadge(roadStatus.quality)}
                </div>
                <div>
                  <strong>Payment Status:</strong>
                  {renderPaymentBadge(roadStatus.payment)}
                </div>
                <div>
                  <strong>Contract Value:</strong>
                  {roadStatus.amount} ETH
                </div>
                <div>
                  <strong>Contract Balance:</strong>
                  {contractBalance} ETH
                </div>
              </div>

              {roadStatus.comments && (
                <div className="comments-section">
                  <h4>Inspector Comments</h4>
                  <p>{roadStatus.comments}</p>
                </div>
              )}

              {roadStatus && parseFloat(contractBalance) < parseFloat(roadStatus.amount) && (
                <div className="alert alert-warning">
                  ⚠️ Insufficient contract balance! Needs additional:{" "}
                  {(parseFloat(roadStatus.amount) - parseFloat(contractBalance)).toFixed(4)} ETH
                </div>
              )}

              <button
                onClick={releasePayment}
                disabled={!canReleasePayment() || isLoading}
                className={`release-btn ${canReleasePayment() ? "" : "disabled"}`}
              >
                {isLoading ? "Processing..." : "Release Payment"}
              </button>
            </div>
          ) : (
            <p>No contract data available</p>
          )}
        </>
      )}

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
