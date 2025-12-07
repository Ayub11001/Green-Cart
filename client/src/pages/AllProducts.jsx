import { React, useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
    const { products, searchQuery } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(
        () => {
            if(searchQuery.length > 0) {
                setFilteredProducts(
                    products.filter(
                        (product) => product.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                )
            } else {
                setFilteredProducts(products);
            }
        },
        [searchQuery, products]
    )

  return (
    <div className='mt-16 flex flex-col'>
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium uppercase'>ALL PRODUCTS</p>
            <div className='w-16 h-0.5 rounded-full bg-primary'></div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
            {
                filteredProducts.filter(
                    product => product.inStock 
                ).map(
                    (product, index) => (
                        <ProductCard key={index} product={product}/>
                    )
                )
            }
        </div>
    </div>
  )
}

export default AllProducts