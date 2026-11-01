import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CheckoutSuccess from './pages/CheckoutSuccess'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout-success" element={<CheckoutSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
