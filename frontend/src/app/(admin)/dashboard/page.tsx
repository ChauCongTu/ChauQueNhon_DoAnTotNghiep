"use client";
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table } from 'antd';
import ChartComponent from '@/components/chart/base/page';
import StatistcalSide from '@/components/dashboard/dashboard/statistical/page';
import VibrantTable from '@/components/dashboard/dashboard/vibrant/page';
import LineRegistrationChart from '@/components/dashboard/dashboard/registration/page';
import UserRolePieChart from '@/components/dashboard/dashboard/role/page';
import TrendStatiscal from '@/components/dashboard/dashboard/trend/page';
import MostViewTable from '@/components/dashboard/dashboard/document/page';
import Statistics from '@/components/dashboard/dashboard/statistics/page';

const Dashboard = () => {
    const [allow, setAllow] = useState(true);

    return (
        <>
            {
                allow
                    ? (
                        <div className='bg-white rounded shadow'>
                            <div className='px-10xs md:px-10md text-24xs md:text-24md font-bold border-b py-10xs md:py-10md'>DASHBOARD</div>
                            <div className='px-10xs md:px-10md h-auto py-10xs md:py-16md'>
                                <StatistcalSide />
                                <div className='mt-8xs md:mt-8md'>
                                    <VibrantTable />
                                </div>
                                <div className='mt-10xs md:mt-38md'>
                                    <Statistics />
                                </div>
                                <div className='flex gap-10xs md:gap-48md mt-10xs md:mt-38md'>
                                    <div className='w-full md:w-1/2'><LineRegistrationChart /></div>
                                    <div className='w-full md:w-1/2'><UserRolePieChart /></div>
                                </div>
                                <div className='mt-10xs md:mt-38md'>
                                    <div className='flex gap-10xs md:gap-10md justify-between items-center'>
                                        <div className='w-full md:w-2/6'>
                                            <TrendStatiscal />
                                        </div>
                                        <div className='w-full md:w-3/6'>
                                            <MostViewTable />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <div>Bạn chưa được cấp role để truy cập vào đây</div>
                    )
            }
        </>
    );
};

export default Dashboard;
