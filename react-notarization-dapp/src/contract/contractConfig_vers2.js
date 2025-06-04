export const contractAddress = "0x666b547C015DeBaDAC68F4Ec5c26A3FA91835cAE";
export const contractAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "docHash",
				"type": "bytes32"
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
				"name": "imgHash",
				"type": "bytes32"
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
				"internalType": "bytes32",
				"name": "fullHash",
				"type": "bytes32"
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
				"internalType": "bytes32",
				"name": "_docHash",
				"type": "bytes32"
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
				"internalType": "bytes32",
				"name": "_imgHash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "_fullHash",
				"type": "bytes32"
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
				"internalType": "bytes32",
				"name": "_docHash",
				"type": "bytes32"
			}
		],
		"name": "documentExists",
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
				"name": "_docHash",
				"type": "bytes32"
			}
		],
		"name": "getDocument",
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
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_imgHash",
				"type": "bytes32"
			}
		],
		"name": "getImage",
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
				"internalType": "bytes32",
				"name": "fullHash",
				"type": "bytes32"
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
		"name": "getMyDocumentsHashes",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "docs",
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
		"name": "getMyImagesHashes",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "images",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_imgHash",
				"type": "bytes32"
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
	}
]