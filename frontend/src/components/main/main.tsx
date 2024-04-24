import React from 'react'
import HomeSlider from './slider'
import MainCategory from './home/category'

const MainHomePage = () => {
  return (
    <div className='mt-20xs md:mt-20md'>
        <div className='!w-full md:!w-745md'><HomeSlider /></div>
        <div><MainCategory /></div>
    </div>
  )
}

export default MainHomePage