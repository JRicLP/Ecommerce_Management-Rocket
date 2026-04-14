import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Catalog from './pages/Catalog'
import ProductDetails from './pages/ProductDetails'
import ProductFormulary from './pages/ProductFormulary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/produtos/:id" element={<ProductDetails />} />
        <Route path="/produtos/novo" element={<ProductFormulary />} />
        <Route path="/produtos/:id/editar" element={<ProductFormulary />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
