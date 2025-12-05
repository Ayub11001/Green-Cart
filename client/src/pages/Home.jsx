import React from 'react'
import MainBanner from '../components/MainBanner.jsx';
import Categories from '../components/Categories.jsx';

const Home = () => {
  return (
    <div className = 'mt-10'>
        <MainBanner></MainBanner>
        <Categories></Categories>
    </div>
  )
}

export default Home