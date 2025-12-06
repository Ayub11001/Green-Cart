import React from 'react'
import MainBanner from '../components/MainBanner.jsx';
import Categories from '../components/Categories.jsx';
import BestSeller from '../components/BestSeller.jsx';

const Home = () => {
  return (
    <div className = 'mt-10'>
        <MainBanner></MainBanner>
        <Categories></Categories>
        <BestSeller></BestSeller>
    </div>
  )
}

export default Home