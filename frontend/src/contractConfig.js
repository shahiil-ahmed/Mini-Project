export const attendanceAddress = "0x6bC722B08C9fa502e89115340Ac1874b06EE8349";
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
	}
]
export const qualityContractAddress  = "0xFB3A14fc9C3A2aFc9047D73E246Bd56647898a64";
export const qualityContractABI = [
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
			},
			{
				"internalType": "address[3]",
				"name": "_inspectors",
				"type": "address[3]"
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
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stage",
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
				"internalType": "uint256",
				"name": "stage",
				"type": "uint256"
			},
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
		"inputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "materialQuality",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "safetyCompliance",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "designSpecs",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "environmentalImpact",
						"type": "bool"
					}
				],
				"internalType": "struct QualityCheckAndPayment.InspectionChecklist",
				"name": "_checklist",
				"type": "tuple"
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
				"internalType": "enum QualityCheckAndPayment.InspectionStage",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "address[3]",
				"name": "",
				"type": "address[3]"
			},
			{
				"components": [
					{
						"internalType": "bool",
						"name": "materialQuality",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "safetyCompliance",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "designSpecs",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "environmentalImpact",
						"type": "bool"
					}
				],
				"internalType": "struct QualityCheckAndPayment.InspectionChecklist",
				"name": "",
				"type": "tuple"
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
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountReleased",
				"type": "uint256"
			},
			{
				"internalType": "enum QualityCheckAndPayment.InspectionStage",
				"name": "currentStage",
				"type": "uint8"
			},
			{
				"components": [
					{
						"internalType": "bool",
						"name": "materialQuality",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "safetyCompliance",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "designSpecs",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "environmentalImpact",
						"type": "bool"
					}
				],
				"internalType": "struct QualityCheckAndPayment.InspectionChecklist",
				"name": "checklist",
				"type": "tuple"
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
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_comments",
				"type": "string"
			}
		],
		"name": "submitCorrection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]