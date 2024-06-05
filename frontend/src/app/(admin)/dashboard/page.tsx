import React from 'react'

type Props = {}

const Dashboard = (props: Props) => {
    return (
        <div className='bg-white rounded shadow'>
            <div className='px-10xs md:px-10md text-24xs md:text-24md font-bold border-b py-10xs md:py-10md'>DASHBOARD</div>
            <div className='px-10xs md:px-10md h-auto'>
                Nội dung
            </div>
        </div>
    )
}

export default Dashboard