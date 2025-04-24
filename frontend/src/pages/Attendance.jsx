import React, { useState } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { attendanceAddress, attendanceABI } from "../contractConfig";

const Attendance = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [session, setSession] = useState("morning");
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("");

  const sessionToBytes32 = (session) => {
    return ethers.keccak256(ethers.toUtf8Bytes(session));
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert(`Connection failed: ${err.message}`);
    }
  };

  const markAttendance = async () => {
    if (!workerId || isNaN(workerId)) {
      alert("Please enter a valid Worker ID");
      return;
    }

    setIsLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(attendanceAddress, attendanceABI, signer);

      const sessionHash = sessionToBytes32(session);
      const tx = await contract.markAttendance(parseInt(workerId), sessionHash);
      
      await tx.wait();
      alert(`✅ Attendance marked for Worker ${workerId} (${session})`);
      checkAttendance();
    } catch (err) {
      console.error("Transaction failed:", err);
      alert(`Error: ${err.reason || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAttendance = async () => {
    if (!workerId) return;
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(attendanceAddress, attendanceABI, provider);
      
      const today = Math.floor(Date.now() / 86400000) * 86400;
      const [morning, evening] = await contract.getAttendance(workerId, today);
      
      setAttendanceStatus(
        `Today's attendance: ${morning ? "☀️ Morning" : ""} ${
          evening ? "🌙 Evening" : ""
        }`.trim()
      );
    } catch (err) {
      console.error("Fetch error:", err);
      setAttendanceStatus("Could not fetch attendance");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🏗️ Worker Attendance Portal</h2>
      
      {!walletAddress ? (
        <button style={styles.button} onClick={connectWallet}>
          Connect MetaMask
        </button>
      ) : (
        <>
          <p style={styles.wallet}>
            Connected: <code>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</code>
          </p>

          <div style={styles.inputGroup}>
            <input
              type="number"
              placeholder="Worker ID"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              style={styles.input}
              onBlur={checkAttendance}
            />

            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              style={styles.select}
            >
              <option value="morning">Morning Shift</option>
              <option value="evening">Evening Shift</option>
            </select>

            <button 
              onClick={markAttendance} 
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Mark Attendance"}
            </button>
          </div>

          {attendanceStatus && (
            <div style={styles.status}>{attendanceStatus}</div>
          )}
        </>
      )}
    </div>
  );
};

// Style object
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    color: "#2c3e50",
    borderBottom: "2px solid #eee",
    paddingBottom: "10px"
  },
  button: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    margin: "5px 0"
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
    margin: "20px 0",
    flexWrap: "wrap"
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    flex: "1",
    minWidth: "120px"
  },
  select: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    background: "white"
  },
  wallet: {
    backgroundColor: "#f8f9fa",
    padding: "10px",
    borderRadius: "4px",
    wordBreak: "break-all"
  },
  status: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#e8f4fd",
    borderRadius: "4px"
  }
};

export default Attendance;