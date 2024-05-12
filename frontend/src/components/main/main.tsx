import React from 'react'
import HomeSlider from './slider'
import MainCategory from './home/category'
import { useAuth } from '@/providers/authProvider';
import MainArena from './home/arena';
import MainTopic from './home/topic';
import MainStatistics from './home/statistics';
import MainFeatures from './home/features';
import MainUsers from './home/users';

const MainHomePage = () => {
  const { user } = useAuth();
  return (
    <div className='mt-20xs md:mt-20md w-full'>
      <div className='!w-full md:!max-w-1085md'><HomeSlider /></div>
      <div className='!w-full'><MainCategory user={user} /></div>
      <div className='!w-full'><MainArena user={user} /></div>
      <div className='!w-full'><MainTopic /></div>
      <div><MainFeatures /></div>
      <div><MainUsers /></div>
      <div><MainStatistics /></div>
    </div>
  )
}

export default MainHomePage