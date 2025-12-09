import {useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom';
import {assets} from '../assets/assets.js';
import { useAppContext } from '../context/AppContext.jsx';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const {
        user,
        setUser,
        showUserLogin,
        setShowUserLogin,
        navigate,
        searchQuery,
        setSearchQuery,
        getCartCount,
    } = useAppContext(); 

    const logout = async () => {
        setUser(null);
        navigate('/');
    }

    useEffect(
        () => {
            if(searchQuery.length > 0) {
                navigate('/products');
            }
        },
        [searchQuery]
    )

  return (
    <div>
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
           
            {/* Logo */}
            <NavLink to={'/'} onClick={() => setOpen(false)}>
                <img src={assets.logo} alt="logo" />
            </NavLink>


            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to={'/'}>Home</NavLink>
                <NavLink to={'/products'}>All Products</NavLink>
                
                

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input 
                    onChange={ (e) => setSearchQuery(e.target.value) }
                    className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products"
                    />
                    <img 
                        src={assets.search_icon} 
                        alt="search-icon" 
                        className = {"w-4 h-4"}
                    />
                </div>

                <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                    <img 
                        src={assets.cart_icon} 
                        alt=""
                        className ='w-6 opacity-80' 
                    />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {
                    !user ?
                    (<button 
                        className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
                        onClick={() => {
                            setShowUserLogin(true);
                        }}
                    >
                        Login
                    </button>) :
                    (
                        <div className='relative group'>
                            <img src={assets.profile_icon} className = "w-10" alt="" />
                            <ul className = "hidden group-hover:block absolute top-10 right-0 bg-white shadow-md border border-gray-200 rounded-md text-sm py-2.5 w-30 z-40">
                                
                                <li 
                                    className = 'p-1.5 pl-3 hover:bg-primary/20 cursor-pointer'
                                    onClick={() => navigate('/my-orders')}
                                >
                                    My Orders
                                </li>

                                <li 
                                    className = 'p-1.5 pl-3 hover:bg-primary/20 cursor-pointer'
                                    onClick={logout}
                                >
                                    logout
                                </li>
                            </ul>
                        </div>
                    )
                }
            </div>

        {/* Mobile Menu Button */}
        
            <div className='flex items-center gap-6 sm:hidden'>
                
                <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                    <img 
                        src={assets.cart_icon} 
                        alt=""
                        className = { 'w-6 opacity-80' }
                    />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                    <img src={assets.menu_icon} alt="menu-icon" />
                </button>
            </div>

            {/* Mobile Menu */}
            {
                open && (<div className={`${open ? 'flex' : 'hidden'} absolute z-50 top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                    <NavLink to = {'/'} onClick = { () => setOpen(false) }>Home</NavLink>
                    <NavLink to = {"/products"} onClick = { () => setOpen(false) }>All Products</NavLink>
                {user && <NavLink to = {'/my-orders'} onClick = { () => setOpen(false) }>My Orders</NavLink>}
                <NavLink to = '/' onClick= { () => setOpen(false) }>Contact</NavLink>
                
                {
                    !user ? (
                        <button 
                            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
                            onClick={() => {
                                setOpen(false);
                                setShowUserLogin(true);
                            }}
                        >
                            Login
                        </button>
                    ) :
                    (
                        <button 
                            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    )
                }
            </div>)}

        </nav>
    </div>
  )
}

export default Navbar