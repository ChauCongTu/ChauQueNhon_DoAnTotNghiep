import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { TopicType } from '@/modules/topics/types';
import { getTopics } from '@/modules/topics/services';
import TopicItem from '@/components/topic/item';
import { resolveSoa } from 'dns';
import Link from 'next/link';

type Props = {}

const MainTopic = (props: Props) => {
    const [topics, setTopics] = useState<TopicType[]>();
    useEffect(() => {
        getTopics({ perPage: 10, with: ['comments'] }).then((res) => {
            if (res.status && res.status.code === 200) {
                setTopics(res.data[0].data);
            }
        });
    }, []);
    return (
        <div className='border-y-2 border-primary mt-40xs md:mt-40md'>
            <div className='mt-20xs md:mt-20md text-24xs md:text-24md leading-27xs md:leading-27md font-bold'>CÙNG THẢO LUẬN NHÉ</div>
            <div className='mt-25xs md:mt-25md flex flex-wrap justify-between'>
                {
                    topics && topics.map((vl) => (
                        <div key={vl.id} className='w-full md:w-1/2'>
                            <div className='px-5xs md:px-5md'>
                                <TopicItem topic={vl} />
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='py-10xs md:py-10md mb-20xs md:mb-20md flex justify-center'><Link href={'/topic'}>Xem thêm</Link></div>
        </div>
    )
}

export default MainTopic