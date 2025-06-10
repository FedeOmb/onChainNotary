import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './Navbar.jsx'
import Notarize from './Notarize.jsx'
import Verify from './Verify.jsx'

export default function App() {
  return (
    <div className="p-4">
      <nav className="mb-4 space-x-4">
        <Link to="/">Home</Link>
        <Link to="/notarize">Notarizza</Link>
        <Link to="/verify">Verifica</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notarize" element={<Notarize />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </div>
  )
}