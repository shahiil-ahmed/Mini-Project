export const attendanceAddress = "0xC57d9Dc4eA5aeeE209aA88EF39b6eA9d44A70d4d";
export const attendanceABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "workerId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "session",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "markedBy",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AttendanceMarked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "workerId",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "session",
				"type": "bytes32"
			}
		],
		"name": "markAttendance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "attendance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "morning",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "evening",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractor",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "workerId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			}
		],
		"name": "getAttendance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "morning",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "evening",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
export const qualityContractAddress  = "0xC6A7449Bb07810213B086C945485C6FE9F423D4D";
export const qualityContractABI = [
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "isGood",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "_comments",
				"type": "string"
			}
		],
		"name": "checkQuality",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_contractor",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_sectionName",
				"type": "string"
			}
		],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contractor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "comments",
				"type": "string"
			}
		],
		"name": "CorrectionRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contractor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PaymentReleased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contractor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "PaymentWithheld",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "enum QualityCheckAndPayment.QualityStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "comments",
				"type": "string"
			}
		],
		"name": "QualityChecked",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "releasePayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_comments",
				"type": "string"
			}
		],
		"name": "requestCorrection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractor",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fundsLocked",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRoadStatus",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "enum QualityCheckAndPayment.QualityStatus",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "enum QualityCheckAndPayment.PaymentStatus",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "organization",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "roadWork",
		"outputs": [
			{
				"internalType": "string",
				"name": "sectionName",
				"type": "string"
			},
			{
				"internalType": "enum QualityCheckAndPayment.QualityStatus",
				"name": "quality",
				"type": "uint8"
			},
			{
				"internalType": "enum QualityCheckAndPayment.PaymentStatus",
				"name": "payment",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "paymentAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "inspectionDate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "comments",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "correctionRequested",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];