import React, { useState } from 'react'
import { ethers } from 'ethers'
import {calculateFileHash, calculateImageHash} from './hashing.js'
import Notarize from './Notarize.jsx'
import Verify from './Verify.jsx'

export default function Upload() {
  const [fileType, setFileType] = useState('document')
  const [docHash, setDocHash] = useState(null)
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [imageHash, setImageHash] = useState(null)
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    const result = await calculateFileHash(file)
    setDocHash(result);

  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
          setImagePreview(null);
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
      const result = await calculateImageHash(file);
      setImageHash(result);
      
    } catch (error) {
      console.error('Errore:', error);
      setError(error.message || 'Si è verificato un errore durante l\'elaborazione dell\'immagine');
    } finally {
      setIsProcessing(false);
    }
  }

  const onOptionChange = (e) => {
    setFileType(e.target.value);
    setFile(null);
    setImage(null);
    setDocHash(null);
    setImageHash(null);
    setImagePreview(null);
  }

  return (
    <div>
      <h2>Notarizza un Documento o un'immagine</h2>

      <input type="radio" name="file-type" value="document" id="document" checked={fileType === "document"} onChange={onOptionChange}/>
      <label htmlFor="document">Documento</label>
      <input type="radio" name="file-type" value="image" id="image" checked={fileType === "image"} onChange={onOptionChange}/>
      <label htmlFor="image">Immagine</label>

      {fileType === "document" && (
        <div>
          <p>Carica qui un documento per calcolare il suo hash</p>
          <input type="file" onChange={handleFileChange} />
          {file && (
            <div>
              <h3>Documento caricato:</h3>
              <p>File: {file.name}</p>
              <p>Dimensione: {file.size} bytes</p>
              <p>Tipo: {file.type}</p>
            </div>
          )}
        </div>
      )}
      {fileType === "image" && (
      <div>
        <p>Carica un'immagine in formato JPEG o PNG</p>
        <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} />
        {/* Anteprima dell'immagine */}
        {imagePreview && (
          <div className="image-preview" style={{ marginBottom: '20px' }}>
            <h3>Immagine caricata:</h3>
            <p>File: {image.name}</p>
            <p>Dimensione: {image.size} bytes</p>
            <p>Tipo: {image.type}</p>
            <img 
              src={imagePreview} 
              alt="Anteprima" 
              style={{ maxWidth: '100%', maxHeight: '300px' }} 
            />
          </div>
        )}
      </div>
      )}
      {isProcessing && (<p>Calcolo dell'hash in corso...</p>)}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fileType === "document" && docHash &&(
          <p>Hash SHA256 del documento: {docHash}</p>
      )}
      {fileType === "image" && imageHash && (
        <div>
          <p>Hash SHA256 dei pixel: {imageHash.pixelHash}</p>
          <p>Hash SHA256 dei metadati: {imageHash.metadataHash}</p>
        </div>
      )}
      {(docHash || imageHash) && (
        <Notarize docHash={docHash} imageHashes={imageHash} />
        )}


  </div>
  )}