import React, { useState } from 'react'
import { ethers } from 'ethers'
import {calculateFileHash, calculateImageHash} from './hashing.js'
import { notarizeDocument, notarizeImage, verifyDocHash, verifyImageHash} from './contract/contractInteraction.js'
import { useMetamask } from './WalletContext.jsx'

export default function Notarize({docHash, imageData}) {
  const { contract, account } = useMetamask();
  const [operation, setOperation] = useState(null)
  const [txReceipt, setTxReceipt] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

 //TODO
 //aggiugnere logica per inviare transazioni

  const handleNotarize = async () => {
    setOperation("notarize");
    setIsProcessing(true);
    setTxReceipt(null);
    setVerificationResult(null);
    setError(null);
  try {
      if(docHash){
      const result = await notarizeDocument(contract, docHash, "SHA256");
      setTxReceipt(result);
      setIsProcessing(false);
      }else if(imageData){
        const result = await notarizeImage(contract, imageData.pixelHash, imageData.metadataHash, imageData.extension, "SHA256", "SHA256");
        setTxReceipt(result);
        setIsProcessing(false);
      }
    } catch (error) {
      if (error?.message?.includes("hash already stored") || error?.reason?.includes("hash already stored")) {
          setError("Transazione annullata: questo hash è già stato memorizzato sulla blockchain.");
      } else {
          setError("Si è verificato un errore durante la notarizzazione: " + error.message);
      }
    } finally{
      setIsProcessing(false);
    }
  }

  const handleVerify = async () => {
    setOperation("verify");
    setIsProcessing(true);
    setTxReceipt(null);
    setVerificationResult(null);
    setError(null);
    try {
      if(docHash){
        const result = await verifyDocHash(contract, docHash);
        console.log("Document verification result:", result);
        setVerificationResult(result);
        setIsProcessing(false);
      }else if(imageData){
        const result = await verifyImageHash(contract, imageData.pixelHash);
        console.log("Image verification result:", result);
        setVerificationResult(result);
        setIsProcessing(false);
      }
    } catch (error) {
      if (error?.message?.includes("not found") || error?.reason?.includes("not found")) {
          setError("Documento non trovato");
      } else {
          setError("Si è verificato un errore durante la verifica: " + error.message);
      }
    } finally{
      setIsProcessing(false);
    }
  }

  return (
    <div>
      
      {(docHash || imageData)  && (
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={handleNotarize}
            style={{ marginRight: '10px', padding: '10px 20px' }}
          >
            Notarizza
          </button>
          <button 
            onClick={handleVerify}
            style={{ padding: '10px 20px' }}
          >
            Verifica
          </button>
        </div>
      )}
      {docHash && operation === "notarize" && (
        <div>
          {isProcessing && 
            (<p>Notarizzazione del documento in corso...</p>
          )}
          {txReceipt && (
            <>
            <p>Hash della transazione: {txReceipt.hash}</p>
            <p>La transazione è stata minata nel blocco: {txReceipt.blockNumber}</p>
            <p>Visualizza la transazione su <a href={`https://sepolia.etherscan.io/tx/${txReceipt.hash}`} target="_blank">Etherscan.io</a></p>
            </>
          )}
          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
             </div>
          )}
        </div>
      )}
      {docHash && operation === "verify" && (
        <div>
          {isProcessing && 
            (<p>Verifica del documento in corso...</p>
          )}
          {verificationResult && (
            <>
            <p>Documento verificato!</p>
            <p>dettagli del documento recuperati:</p>
            <p>Uploader: {verificationResult.uploader}</p>
            <p>Timestamp di upload: {verificationResult.timestamp}</p>
            <p>Data di upload: {verificationResult.readableDate}</p>
            <p>Algoritmo di hash usato: {verificationResult.hashAlgorithm}</p>
            </>
          )}
          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
             </div>
          )}
        </div>
      )}
      {imageData && operation === "notarize" && (
        <div>
          {isProcessing && 
            (<p>Notarizzazione dell'immagine in corso...</p>
          )}
          {txReceipt && (
            <>
            <p>Hash della transazione: {txReceipt.hash}</p>
            <p>La transazione è stata minata nel blocco: {txReceipt.blockNumber}</p>
            <p>Visualizza la transazione su <a href={`https://sepolia.etherscan.io/tx/${txReceipt.hash}`} target="_blank">Etherscan.io</a></p>
            </>
          )}
          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
            </div>
          )}
        </div>
      )}
      {imageData && operation === "verify" && (
        <div>
          {isProcessing && 
            (<p>Verifica del documento in corso...</p>
          )}
          {verificationResult && (
            <>
            <p>Documento verificato!</p>
            <p>dettagli del documento recuperati:</p>
            <p>Uploader: {verificationResult.uploader}</p>
            <p>Timestamp di upload: {verificationResult.timestamp}</p>
            <p>Data di upload: {verificationResult.readableDate}</p>
            <p>Hash dei metadati: {verificationResult.metadataHash}</p>
            <p>Estensione immagine originale: {verificationResult.extension}</p>
            <p>Algoritmo di hash pixel: {verificationResult.pixelHashAlgorithm}</p>
            <p>Algoritmo di hash metadati: {verificationResult.metadataHashAlgorithm}</p>
            </>
          )}
          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
             </div>
          )}
        </div>
      )}

    </div>
  )
}