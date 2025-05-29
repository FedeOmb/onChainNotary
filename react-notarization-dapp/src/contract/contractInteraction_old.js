import { ethers } from "ethers";
import { contractAddress, contractAbi } from "./contractConfig.js";

let provider;
let signer;
let contract;
let contractWithSigner;
let userAddress;
let calcHash;

/*
export async function connectToMetamask() {
  if (typeof window.ethereum !== "undefined") {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        return {provider, signer}
    } catch (error) {
      throw new Error("Error connecting to Metamask: " + error.message);
    }
}}

export async function loadContract() {
    try {
        if (!contractAddress || !contractAbi) {
            throw new Error('Indirizzo del contratto e ABI non trovati');
        }
        console.log("Contract address", contractAddress);
        console.log("ABI", contractAbi);
        
        // Crea l'istanza del contratto
        contract = new ethers.Contract(contractAddress, contractAbi, provider);
        contractWithSigner = contract.connect(signer);
        console.log("Contract created", contract);
        
        return contractWithSigner;
    } catch (error) {
        console.error(error);
        alert(`Errore nel caricamento del contratto: ${error.message}`);
        return false;
    }
}
*/
async function getMyDocumentsHashes(contract) {
    const hashes = await contract.getMyDocumentsHashes();
    
    // Converti gli hash in formato leggibile
    const hashesReadable = hashes.map(hash => ethers.hexlify(hash));    
    console.log("Hashes retrieved:", hashesReadable);
    return hashesReadable;
}

async function getMyFilesCount(contract){
    const count = await contract.getMyFilesCount();
    console.log("Number of files:", count.toString());
    return count;
}

export async function verifyDocHash(contract, hash) {
    try {
        console.log("Hash da verificare:", hash);
        const result = await contract.getDocument(hash);
        
        const [uploader, timestamp, hashAlgorithm] = result;
        const date = new Date(Number(timestamp) * 1000);
        console.log(result);
        console.log(date)
    
    return {
      uploader: uploader,
      timestamp: timestamp.toString(),
      readableDate: date.toLocaleString(),
      hashAlgorithm: hashAlgorithm,
    };
} catch (error) {
    console.error("Errore durante la verifica del documento:", error);
    throw error;
  }
}

export async function verifyImageHash(contract, hash) {
    try {
        console.log("Hash da verificare:", hash);
        const result = await contract.getImage(hash);
        
        const [uploader, timestamp, metadataHash, extension, pixelHashAlgorithm, metadataHashAlgorithm] = result;
        const date = new Date(Number(timestamp) * 1000);
        console.log(result);
        console.log(date)
    return {
        uploader: uploader,
        timestamp: timestamp.toString(),
        readableDate: date.toLocaleString(),
        metadataHash: metadataHash,
        extension: extension,
        pixelHashAlgorithm: pixelHashAlgorithm,
        metadataHashAlgorithm: metadataHashAlgorithm,
    };
} catch (error) {
    console.error("Errore durante la verifica del documento:", error);
    throw error;
  }    
}

export async function notarizeDocument(contract, hash, algorithm){
    try{
        const tx = await contract.storeDocument(hash, algorithm);
        console.log("Transaction sent:", tx);
        const txReceipt = await tx.wait();
        console.log("Documento salvato", txReceipt);
        return  txReceipt;
    } catch (error) {
        console.error("Errore durante la notarizzazione del documento:", error);
        throw error;}
}
export async function notarizeImage(contract, pixelHash, metadataHash, extension, algoPixelHash, algoMetadataHash){
    try{
        const tx = await contract.storeImage(pixelHash, metadataHash, extension, algoPixelHash, algoMetadataHash);
        console.log("Transaction sent:", tx);
        const txReceipt = await tx.wait();
        console.log("Documento salvato", txReceipt);
        return  txReceipt;
    } catch (error) {
        console.error("Errore durante la notarizzazione dell'immagine:", error);
        throw error;
    }
}