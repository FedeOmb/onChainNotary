import { ethers } from "ethers";
import { contractAddress, contractAbi } from "./contractConfig.js";

let provider;
let signer;
let contract;
let contractWithSigner;
let userAddress;
let calcHash;


const infoElement = document.getElementById("account-info");

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

async function getMyDocumentsHashes() {
    const hashes = await contractWithSigner.getMyDocumentsHashes();
    
    // Converti gli hash in formato leggibile
    const hashesReadable = hashes.map(hash => ethers.hexlify(hash));    
    console.log("Hashes retrieved:", hashesReadable);
    return hashesReadable;
}

async function getMyFilesCount(){
    const count = await contractWithSigner.getMyFilesCount();
    console.log("Number of files:", count.toString());
    return count;
}

async function verifyDocHash(docHash) {
    try {
        console.log("Hash da verificare:", docHash);
        const result = await contractWithSigner.getDocument(docHash);
        
        const [uploader, timestamp, hashAlgorithm] = result;
        
        const date = new Date(Number(timestamp) * 1000);
    
    return {
      uploader,
      timestamp: timestamp.toString(),
      readableDate: date.toLocaleString(),
      hashAlgorithm
    };
} catch (error) {
    console.error("Errore durante la verifica del documento:", error);
    throw error;
  }
}

async function notarizeDocument(){
    try{
        const tx = await contractWithSigner.storeDocument(calcHash, "sha256");
        console.log("Transaction sent:", tx);
        const receipt = await tx.wait();
        console.log("Documento salvato", receipt);
        const resultDiv = document.getElementById('transaction-result');
        resultDiv.innerHTML = `
            <h3>Document notarized!</h3>
            <p><strong>Transaction Hash:</strong> ${receipt.hash}</p>
            <p><strong>Block Number:</strong> ${receipt.blockNumber}</p>
        `;
    } catch (error) {
        console.error("Errore durante la notarizzazione:", error);
        alert("Errore durante la notarizzazione del documento");
    }

}

