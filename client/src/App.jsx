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
import SellerLogin from './components/seller/SellerLogin.jsx';
import SellerLayout from './pages/seller/SellerLayout.jsx';
import AddProducts from './pages/seller/addProducts.jsx';
import ProductList from './pages/seller/ProductList.jsx';
import Orders from './pages/seller/Orders.jsx';

const App = () => {
  const { showUserLogin, isSeller } = useAppContext();
  const isSellerPath = useLocation().pathname.includes('/seller');
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerPath ? null : <Navbar/>}
      {showUserLogin ? <Login/> : null}
      <Toaster/>
     
      <div className = {`${isSellerPath ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32'}`}>
        <Routes>
          <Route path='/' element = {<Home/>}/>
          <Route path='/products' element={<AllProducts/>}/>
          <Route path='/products/:category' element={<ProductsCategory/>}/>
          <Route path='/products/:category/:id' element={<ProductDetails/>}/>
          <Route path='/cart' element = {<CartPage/>}/>
          <Route path='/add-address' element = {<AddAddressPage/>}/>
          <Route path='/my-orders' element = {<MyOrders/>}/>
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={isSeller ? <AddProducts/> : null}/>
            <Route path='product-list' element={<ProductList/>}/>
            <Route path='orders' element={<Orders/>}/>
          </Route>
        </Routes>
      </div>
    
      <Footer></Footer>
    </div>
  )
}

export default App