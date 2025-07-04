import React, { useContext } from 'react'
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import HeroSection from '../../components/heroSection/HeroSection';
import Filter from '../../components/filter/Filter';
import ProductCard from '../../components/productCard/ProductCard';
import Track from '../../components/track/Track';
import Testimonial from '../../components/testimonial/Testimonial';
import { useDispatch, useSelector } from 'react-redux';


function Home() {
    const dispatch = useDispatch();
    const cartItem = useSelector((state)=> state.state)

    console.log(cartItem) 
    
    const addcart = () => {
      dispatch(addToCart("shirt"));
    }
     const deleteCart = () => {
      dispatch(deleteFromCart("shirt"));
     }
  return (
    <Layout>
      <div className="flex gap-5 justify-center">
        <button className='bg-gray-300 p-5' onClick={()=> addCart()}>add</button>
        <button className='bg-gray-300 p-5' onClick={()=> deleteCart()}>del</button>
      </div>
      <HeroSection />
      <Filter/>
      <ProductCard/>
      <Track/>
      <Testimonial/>
    </Layout>
  )
}

export default Home