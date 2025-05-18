// File: src/pages/Verify.jsx
import React, { useState } from 'react'

export default function Verify() {
  const [inputHash, setInputHash] = useState('')

  return (
    <div>
      <h2>Verifica hash notarizzato</h2>
      <input
        type="text"
        placeholder="Inserisci hash"
        value={inputHash}
        onChange={(e) => setInputHash(e.target.value)}
      />
      {/* Qui potresti aggiungere integrazione per interrogare lo smart contract */}
    </div>
  )
}