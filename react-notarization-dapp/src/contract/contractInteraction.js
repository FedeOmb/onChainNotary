import { ethers } from "ethers";
import { contractAddress, contractAbi } from "./contractConfig.js";

let provider;
let signer;
let contract;
let contractWithSigner;
let userAddress;
let calcHash;

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
        
        const [uploader, timestamp, fullHash, extension, pixelHashAlgorithm, fullHashAlgorithm] = result;
        const date = new Date(Number(timestamp) * 1000);
        console.log(result);
        console.log(date)
    return {
        uploader: uploader,
        timestamp: timestamp.toString(),
        readableDate: date.toLocaleString(),
        fullHash: fullHash,
        extension: extension,
        pixelHashAlgorithm: pixelHashAlgorithm,
        fullHashAlgorithm: fullHashAlgorithm,
    };
} catch (error) {
    console.error("Errore durante la verifica del documento:", error);
    throw error;
  }    
}

export async function notarizeDocument(contract, hash, algorithm, extension){
    try{
        const tx = await contract.notarizeDocument(hash, algorithm, extension);
        console.log("Transaction sent:", tx);
        const txReceipt = await tx.wait();
        console.log("Documento salvato", txReceipt);
        return  txReceipt;
    } catch (error) {
        console.error("Errore durante la notarizzazione del documento:", error);
        throw error;}
}
export async function notarizeImage(contract, pixelHash, fullHash, extension, algoPixelHash, algoFullHash){
    try{
        const tx = await contract.notarizeImage(pixelHash, fullHash, extension, algoPixelHash, algoFullHash);
        console.log("Transaction sent:", tx);
        const txReceipt = await tx.wait();
        console.log("Documento salvato", txReceipt);
        return  txReceipt;
    } catch (error) {
        console.error("Errore durante la notarizzazione dell'immagine:", error);
        throw error;
    }
}

export async function documentExists(contract, hash) {
    try {
        const exists = await contract.documentExists(hash);
        console.log("Document exists:", exists);
        return exists;
    } catch (error) {
        console.error("Errore durante la verifica del documento:", error);
        throw error;
    }
}

export async function imageExists(contract, hash) {
    try {
        const exists = await contract.imageExists(hash);
        console.log("Document exists:", exists);
        return exists;
    } catch (error) {
        console.error("Errore durante la verifica dell'immagine:", error);
        throw error;
    }
}

export async function getMyDocumentsHashes(contract) {
    const hashes = await contract.getMyDocumentsHashes();
    
    // Converti gli hash in formato leggibile
    const hashesReadable = hashes.map(hash => ethers.hexlify(hash));    
    console.log("Hashes retrieved:", hashesReadable);
    return hashesReadable;
}

export async function getMyImagesHashes(contract) {
    const hashes = await contract.getMyImagesHashes();
    
    // Converti gli hash in formato leggibile
    const hashesReadable = hashes.map(hash => ethers.hexlify(hash));    
    console.log("Hashes retrieved:", hashesReadable);
    return hashesReadable;
}

export async function getMyFilesCount(contract){
    const count = await contract.getMyFilesCount();
    console.log("Number of documents:", count[0].toString());
    console.log("Number of images:", count[1].toString());
    return {
        images: count[0].toString(),
        documents: count[1].toString()
    };
}