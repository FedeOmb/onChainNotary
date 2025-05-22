import React, { useState } from 'react'
import { ethers } from 'ethers'
import {calculateFileHash, calculateImageHash} from './hashing.js'
import { notarizeDocument } from './contract/contractInteraction.js'
import { useMetamask } from './WalletContext.jsx'

export default function Notarize({docHash, imageHashes}) {
  const { contract, account } = useMetamask();
  const [operation, setOperation] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [txReceipt, setTxReceipt] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

 //TODO
 //aggiugnere logica per inviare transazioni

  const handleNotarize = async () => {
    setOperation("notarize");
    setIsProcessing(true);
    setError(null);
    if(docHash){
    const result = await notarizeDocument(contract, docHash);
    setTxHash(result.txHash);
    setTxReceipt(result.txReceipt);

    }else if(imageHashes){
      //TODO
    }
  }

  return (
    <div>
      
      {(docHash || imageHashes)  && (
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={handleNotarize}
            style={{ marginRight: '10px', padding: '10px 20px' }}
          >
            Notarizza
          </button>
          <button 
            onClick={handleNotarize}
            style={{ padding: '10px 20px' }}
          >
            Verifica
          </button>
        </div>
      )}
      {docHash && operation === "notarize" && isProcessing && (
        <div style={{ marginTop: '20px' }}>
          <p>Notarizzazione del documento in corso...</p>
          {txReceipt && (
            <>
            <p>Hash della transazione: {txReceipt.hash}</p>
            <p>La transazione è stata minata nel blocco: {txReceipt.blockNumber}</p>
            </>
          )}
        </div>
      )
      }

    </div>
  )
}