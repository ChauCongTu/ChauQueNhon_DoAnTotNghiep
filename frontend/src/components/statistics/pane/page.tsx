import React, { useEffect, useState } from 'react';
import { Table, Breadcrumb, Select, Typography, Spin, Card, Row, Col } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';
import { User } from '@/modules/users/type';
import ProfileMenu from '@/components/profile/menu/page';
import { getMyStatistics } from '@/modules/users/services';
import ChartComponent from '@/components/chart/base/page';
import { CSVLink } from 'react-csv';
import CSVExport from './export/statistics/page';

const { Title, Paragraph } = Typography;

interface StatisticPageProps {
    user: User;
}

interface Statistic {
    interval: number;
    type: string;
    start_date: string;
    end_date: string;
    stats: {
        total_time: number;
        total_exams: number;
        total_practices: number;
        total_arenas: number;
        histories: any[];
        min_score: number;
        max_score: number;
        avg_score: number;
        late_submissions: number;
        accuracy: number;
        most_done_subject: number;
        subjects_done_today: any[];
        total_questions_done: number;
    };
}

const StatisticsPane: React.FC<StatisticPageProps> = ({ user }) => {
    const [statistics, setStatistics] = useState<Statistic[]>([]);
    const [type, setType] = useState<'d' | 'w' | 'm' | 'y'>('d');
    const [numb, setNumb] = useState(7);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            const res = await getMyStatistics({ type: type, numb: numb });
            if (res.status.success) {
                setStatistics(res.data[0]);
            }
            setLoading(false);
        };
        fetchStatistics();
    }, [type, numb]);

    const getWeekNumber = (date: Date) => {
        const onejan = new Date(date.getFullYear(), 0, 1);
        const millisecsInDay = 86400000;
        return Math.ceil(((date.getTime() - onejan.getTime()) / millisecsInDay + onejan.getDay() + 1) / 7);
    };

    const columns: ColumnsType<Statistic> = [
        {
            title: type === 'd' ? 'Ngày' : type === 'w' ? 'Tuần thứ' : type === 'm' ? 'Tháng' : 'Năm',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (start_date, record) => {
                if (type === 'w') {
                    // Lấy số tuần từ ngày bắt đầu
                    const startDate = new Date(start_date);
                    const weekNumber = getWeekNumber(startDate);
                    return `Tuần ${weekNumber}`;
                } else if (type === 'm') {
                    // Lấy tháng từ ngày bắt đầu
                    const startDate = new Date(start_date);
                    const month = startDate.toLocaleString('default', { month: 'long' });
                    return month;
                } else if (type === 'y') {
                    // Lấy năm từ ngày bắt đầu
                    const startDate = new Date(start_date);
                    return startDate.getFullYear().toString();
                } else {
                    return start_date;
                }
            },
        },
        {
            title: 'Thời gian tổng',
            dataIndex: ['stats', 'total_time'],
            key: 'total_time',
        },
        {
            title: 'Số lượng bài thi',
            dataIndex: ['stats', 'total_exams'],
            key: 'total_exams',
        },
        {
            title: 'Số lượng luyện tập',
            dataIndex: ['stats', 'total_practices'],
            key: 'total_practices',
        },
        {
            title: 'Số lượng đấu trường',
            dataIndex: ['stats', 'total_arenas'],
            key: 'total_arenas',
        },
        {
            title: 'Điểm trung bình',
            dataIndex: ['stats', 'avg_score'],
            key: 'avg_score',
        },
        // Add more columns as needed
    ];

    const labels = statistics.map(stat => stat.start_date);
    const avgScores = statistics.map(stat => stat.stats?.avg_score ?? 0);
    const maxScores = statistics.map(stat => stat.stats?.max_score ?? 0);
    const minScores = statistics.map(stat => stat.stats?.min_score ?? 0);

    return (
        <>
            <div>
                <Paragraph className="mb-4">
                    Cung cấp thống kê chi tiết về hoạt động học tập của bạn theo các khoảng thời gian khác nhau.
                    <CSVExport statistics={statistics} />
                </Paragraph>
                <Card className="mb-4">
                    <Row gutter={16}>
                        <Col span={12}>
                            <label htmlFor="typeSelect" className="block text-sm font-medium text-gray-700">Thống kê theo</label>
                            <Select
                                id="typeSelect"
                                value={type}
                                onChange={value => setType(value)}
                                style={{ width: '100%' }}
                            >
                                <Select.Option value="d">Ngày</Select.Option>
                                <Select.Option value="w">Tuần</Select.Option>
                                <Select.Option value="m">Tháng</Select.Option>
                                <Select.Option value="y">Năm</Select.Option>
                            </Select>
                        </Col>
                        <Col span={12}>
                            <label htmlFor="numbSelect" className="block text-sm font-medium text-gray-700">Số ngày</label>
                            <Select
                                id="numbSelect"
                                value={numb}
                                onChange={value => setNumb(value)}
                                style={{ width: '100%' }}
                            >
                                <Select.Option value={7}>7 ngày</Select.Option>
                                <Select.Option value={14}>14 ngày</Select.Option>
                                <Select.Option value={30}>30 ngày</Select.Option>
                                {/* Add more options as needed */}
                            </Select>
                        </Col>
                    </Row>
                </Card>

                {loading ? (
                    <div className="text-center my-8">
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        <Table
                            dataSource={statistics}
                            columns={columns}
                            rowKey="interval"
                            pagination={{ pageSize: 5, hideOnSinglePage: true }}
                        />
                        <div className="my-8">
                            {statistics.length > 0 ? (
                                <ChartComponent
                                    labels={labels}
                                    values={avgScores}
                                    type="line"
                                    title="Điểm trung bình theo thời gian"
                                    datasetLabel="Điểm trung bình"
                                />
                            ) : (
                                <p>Không có dữ liệu để hiển thị.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default StatisticsPane;
