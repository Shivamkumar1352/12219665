import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Stats from './pages/Stats'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/stats" element={<Stats />} />
    </Routes>
  )
}
