// File: src/pages/Notarize.jsx
import React, { useState } from 'react'
import { ethers } from 'ethers'
import {calculateFileHash, calculateImageHash} from './hashing.js'

export default function Notarize() {
  const [hash, setHash] = useState(null)
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [imageHashResult, setImageResult] = useState(null)
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fileHash = await calculateFileHash(file)
    setHash(fileHash)
    setFile(file)
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      // Crea un'anteprima dell'immagine
      setImagePreview(URL.createObjectURL(file));
      
      // Determina il tipo di file
      const isPNG = file.type === 'image/png';
      const isJPEG = file.type === 'image/jpeg';
      
      if (!isPNG && !isJPEG) {
        throw new Error('Formato non supportato. Solo PNG e JPEG sono supportati.');
      }
      setImage(file);
      setIsProcessing(true);
      // Processa il file in base al tipo
      const result = await calculateImageHash(file);
      
      setImageResult(result);
    } catch (error) {
      console.error('Errore:', error);
      setError(error.message || 'Si è verificato un errore durante l\'elaborazione dell\'immagine');
    } finally {
      setIsProcessing(false);
    }
  }

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
      <h2>Notarizza un Documento</h2>
      <p>Carica un documento per calcolare il suo hash</p>
      <input type="file" onChange={handleFileChange} />
      {hash && (
        <div>
          <p>Hash SHA256: {hash}</p>
          <p>File: {file.name}</p>
          <p>Dimensione: {file.size} bytes</p>
          <p>Tipo: {file.type}</p>
        </div>
      )}

      <h2>Notarizza un'immagine</h2>
      <p>Carica un'immagine in formato JPEG o PNG</p>
      <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} />
      {/* Anteprima dell'immagine */}
      {imagePreview && (
        <div className="image-preview" style={{ marginBottom: '20px' }}>
          <h3>Immagine caricata:</h3>
          <img 
            src={imagePreview} 
            alt="Anteprima" 
            style={{ maxWidth: '100%', maxHeight: '300px' }} 
          />
        </div>
      )}
      {isProcessing && (<p>Elaborazione in corso...</p>)}      
      {imageHashResult && (
        <div>
          <p>Hash SHA256 dei pixel: {imageHashResult.pixelHash}</p>
          <p>Hash SHA256 dei metadati: {imageHashResult.metadataHash}</p>
          <p>File: {image.name}</p>
          <p>Dimensione: {image.size} bytes</p>
          <p>Tipo: {image.type}</p>
        </div>
      )}


      
    </div>
  )
}