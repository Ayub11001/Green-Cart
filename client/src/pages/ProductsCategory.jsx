import React from 'react'
import { useAppContext } from '../context/AppContext.jsx';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets.js';
import ProductCard from '../components/ProductCard.jsx';


const ProductsCategory = () => {
    const { products, navigate } = useAppContext();  
    const { category } = useParams();

    const filteredProducts = products.filter(
        product => product.category.toLowerCase() === category
    );
    const searchCategory = categories.find( 
        item => item.path.toLowerCase() === category
    );

  return (
    <div className='mt-16'>
        {
            searchCategory && (
                <div className='flex flex-col items-end w-max'>
                    <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
                    <div className='w-16 rounded-full bg-primary h-0.5'></div>
                </div>
            )
        }
        {
            filteredProducts.length > 0 ? (
                <div 
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
                    {
                        filteredProducts.map(
                            product => (
                                <ProductCard key={product._id} product={product}/>
                            )
                        )
                    }
                </div>
            ) : (
                <div className='flex items-center justify-center h-[60vh]'>
                    <p className='text-2xl font-medium text-primary'>No Products found in this Category</p>
                </div>
            )
        }
    </div>
  )
}

export default ProductsCategory