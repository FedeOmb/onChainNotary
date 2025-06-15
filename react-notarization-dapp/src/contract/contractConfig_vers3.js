export const contractAddress = "0x811e18dbCD72f2Cac1CeF8C86Ae3C9924E8717Ee";
export const contractAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "docKey",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "docHash",
				"type": "bytes"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "hashAlgorithm",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "extension",
				"type": "string"
			}
		],
		"name": "DocumentStored",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "imgKey",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "imgHash",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "fullHash",
				"type": "bytes"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "extension",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "imageHashAlgorithm",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fullHashAlgorithm",
				"type": "string"
			}
		],
		"name": "ImageStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_docHash",
				"type": "bytes"
			},
			{
				"internalType": "string",
				"name": "_hashAlgorithm",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_extension",
				"type": "string"
			}
		],
		"name": "notarizeDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_imageHash",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "_fullHash",
				"type": "bytes"
			},
			{
				"internalType": "string",
				"name": "_extension",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_imageHashAlgorithm",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_fullHashAlgorithm",
				"type": "string"
			}
		],
		"name": "notarizeImage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_docHash",
				"type": "bytes"
			}
		],
		"name": "documentExistsByHash",
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
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_docKey",
				"type": "bytes32"
			}
		],
		"name": "documentExistsByKey",
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
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_docHash",
				"type": "bytes"
			}
		],
		"name": "getDocumentByHash",
		"outputs": [
			{
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "hashAlgorithm",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "extension",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_docKey",
				"type": "bytes32"
			}
		],
		"name": "getDocumentByKey",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "docHash",
				"type": "bytes"
			},
			{
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "hashAlgorithm",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "extension",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_imageHash",
				"type": "bytes"
			}
		],
		"name": "getImageByHash",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "fullHash",
				"type": "bytes"
			},
			{
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "extension",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageHashAlgorithm",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "fullHashAlgorithm",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_imageKey",
				"type": "bytes32"
			}
		],
		"name": "getImageByKey",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "imageHash",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "fullHash",
				"type": "bytes"
			},
			{
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "extension",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageHashAlgorithm",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "fullHashAlgorithm",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyDocumentsKeys",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "docKeys",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyFilesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "docsCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "imgCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyImagesKeys",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "imageKeys",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_imageHash",
				"type": "bytes"
			}
		],
		"name": "imageExists",
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
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_imgKey",
				"type": "bytes32"
			}
		],
		"name": "imageExistsByKey",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]