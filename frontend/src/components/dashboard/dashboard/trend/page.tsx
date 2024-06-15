import ChartComponent from '@/components/chart/base/page';
import { getTrendsStatis } from '@/modules/dashboard/services';
import React, { useEffect, useState } from 'react'

type Props = {}

const TrendStatiscal = (props: Props) => {
    const [data, setData] = useState<{ labels: string[], values: number[] }>();
    useEffect(() => {
        const fetch = async () => {
            const res = await getTrendsStatis();
            if (res.status.success) {
                setData(res.data[0]);
                console.log(res.data[0]);
                
            }
        }
        fetch();
    }, [])
    return (
        <div>
            {
                data && <ChartComponent labels={data.labels} values={data.values} type='pie' title='XU HƯỚNG ÔN LUYỆN' />
            }       
        </div>
    )
}

export default TrendStatiscal