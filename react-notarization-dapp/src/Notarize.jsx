import React, { useState } from 'react'
import { ethers } from 'ethers'
import {calculateFileHash, calculateImageHash} from './hashing.js'
import { useMetamask } from './WalletContext.jsx'

export default function Notarize({docHash, imageHashes}) {
  const { contract, account } = useMetamask();
  const [operation, setOperation] = useState(null)
  const [hash, setHash] = useState(null)
  const [imageHashResult, setImageResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

 //TODO
 //aggiugnere logica per inviare transazioni

  const sendTransaction = async () => {
    if (!window.ethereum) return alert('MetaMask non trovato')
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    await signer.sendTransaction({
      to: signer.address,
      value: 0,
      data: '0x' + hash
    })
    alert('Transazione inviata con hash: ' + hash)
  }

  return (
    <div>
      
      {(docHash || imageHashes)  && (
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => setOperation('notarize')}
            style={{ marginRight: '10px', padding: '10px 20px' }}
          >
            Notarizza
          </button>
          <button 
            onClick={() => setOperation('verify')}
            style={{ padding: '10px 20px' }}
          >
            Verifica
          </button>
        </div>
      )}

    </div>
  )
}