import React from 'react'
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import {Route, Routes, useLocation} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer.jsx';
import { useAppContext } from './context/AppContext.jsx';
import Login from './components/Login.jsx';
import AllProducts from './pages/AllProducts.jsx';
import ProductsCategory from './pages/ProductsCategory.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import CartPage from './pages/CartPage.jsx';
import AddAddressPage from './pages/AddAddressPage.jsx';
import MyOrders from './pages/MyOrders.jsx';

const App = () => {
  const { showUserLogin } = useAppContext();
  const isSellerPath = useLocation().pathname.includes('/seller');
  return (
    <div>
      <Navbar></Navbar>
      <Toaster/>
      {
        isSellerPath ? (<>Seller</>) : (
          <div className = {`px-6 md:px-16 lg:px-24 xl:px-32`}>
            <Routes>
              <Route path='/' element = {<Home/>}/>
              <Route path='/products' element={<AllProducts/>}/>
              <Route path='/products/:category' element={<ProductsCategory/>}/>
              <Route path='/products/:category/:id' element={<ProductDetails/>}/>
              <Route path='/cart' element = {<CartPage/>}/>
              <Route path='/add-address' element = {<AddAddressPage/>}/>
              <Route path='/my-orders' element = {<MyOrders/>}/>
            </Routes>
          </div>
        )
      }
      {
        showUserLogin ? <Login/> : null
      }
      <Footer></Footer>
    </div>
  )
}

export default App