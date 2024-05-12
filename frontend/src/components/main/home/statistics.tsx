import React from 'react';
import { Row, Col, Statistic } from 'antd';
import { TrophyOutlined, FileTextOutlined, SolutionOutlined, MessageOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import type { StatisticProps } from 'antd';

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
);

const MainStatistics = () => {
    return (
        <div className="bg-white rounded-lg p-8">
            <div className='text-primary mb-20xs md:mb-20md text-32xs md:text-32md font-bold text-center'>TRANG ÔN LUYỆN VÀ LUYỆN THI ONLINE SỐ 1 DÀNH CHO THPT</div>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Statistic
                        title={
                            <span className="text-f14600 text-20xs md:text-20md">
                                Số thí sinh
                            </span>
                        }
                        value={'200000'}
                        prefix={<SolutionOutlined />}
                        formatter={formatter}
                        valueStyle={{ color: '#f14600', fontSize: '24px', fontWeight: 600 }}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Statistic
                        title={
                            <span className="text-f14600 text-20xs md:text-20md">
                                Số đề thi
                            </span>
                        }
                        value={4000}
                        prefix={<FileTextOutlined />}
                        formatter={formatter}
                        valueStyle={{ color: '#f14600', fontSize: '24px', fontWeight: 600 }}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Statistic
                        title={
                            <span className="text-f14600 text-20xs md:text-20md">
                                Số lượt thi
                            </span>
                        }
                        value={120000}
                        prefix={<TrophyOutlined />}
                        formatter={formatter}
                        valueStyle={{ color: '#f14600', fontSize: '24px', fontWeight: 600 }}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Statistic
                        title={
                            <span className="text-f14600 text-20xs md:text-20md">
                                Số lượt thảo luận
                            </span>
                        }
                        value={80000}
                        prefix={<MessageOutlined />}
                        formatter={formatter}
                        valueStyle={{ color: '#f14600', fontSize: '24px', fontWeight: 600 }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default MainStatistics;
