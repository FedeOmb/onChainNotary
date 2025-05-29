export const contractAddress = "0xE271fFAAA14DF9E4E2982A1CCC15F8BaE4D694b8";
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
			}
		],
		"name": "storeDocument",
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
				"name": "_metadataHash",
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
				"name": "_metadataHashAlgorithm",
				"type": "string"
			}
		],
		"name": "storeImage",
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
				"name": "metadataHash",
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
				"name": "metadataHashAlgorithm",
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
	}
]