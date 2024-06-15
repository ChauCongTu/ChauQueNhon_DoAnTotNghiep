import React, { useEffect, useState } from 'react';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined, NumberOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import { DashboardOverview } from '@/modules/dashboard/type';
import { getOverview } from '@/modules/dashboard/services';

const StatistcalSide = () => {
    const [overview, setOverview] = useState<DashboardOverview>();
    useEffect(() => {
        const fetch = async () => {
            const res = await getOverview();
            if (res.status.success) {
                setOverview(res.data[0]);
            }
        }
        fetch();
    }, []);
    return (
        <div>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Số lượng thí sinh"
                            value={overview?.students}
                            prefix={<LineChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Ngân hàng câu hỏi"
                            value={overview?.questions}
                            prefix={<BarChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Kho đề thi"
                            value={overview?.exams}
                            prefix={<PieChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Số lượt thi"
                            value={overview?.histories}
                            prefix={<NumberOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default StatistcalSide