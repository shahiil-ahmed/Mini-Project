// scripts/interact.js

const hre = require("hardhat");

async function main() {
  const [contractor, worker] = await hre.ethers.getSigners(); // Get local test accounts

  // Get the deployed contract
  const Attendance = await hre.ethers.getContractFactory("Attendance");
  const attendance = await Attendance.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3"); // Update with your deployed address

  console.log("Using contract at:", attendance.target);

  // Register the worker (from contractor)
  const tx1 = await attendance.connect(contractor).registerWorker(worker.address);
  await tx1.wait();
  console.log("Worker registered:", worker.address);

  // Mark morning attendance (from worker)
  const tx2 = await attendance.connect(worker).markAttendance(1, "morning");
  await tx2.wait();
  console.log("Morning attendance marked");

  // Mark evening attendance (from worker)
  const tx3 = await attendance.connect(worker).markAttendance(1, "evening");
  await tx3.wait();
  console.log("Evening attendance marked");

  // Get total days present
  const daysPresent = await attendance.totalDaysPresent(worker.address);
  console.log("✅ Total days present:", daysPresent.toString());
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
