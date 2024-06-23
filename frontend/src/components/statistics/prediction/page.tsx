import React, { useEffect, useState } from 'react';
import { Modal, Button, Drawer, Form, Input, InputNumber, Select, Radio } from 'antd';
import PerformanceIndicator from '../pane/performance/page';
import { User } from '@/modules/users/type';
import { getPredictionRequest, getSubjectUser } from '@/modules/predictions/services';
import { PredictRequest } from '@/modules/predictions/type';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import Performance10 from '../pane/performance/typeten';

type Props = {
    profile: User;
};

type UserInformation = {
    StudyTime: number;
    OnlineCourse: string;
    SchoolType: string;
    ClassType: string;
    SelfStudy: number;
    GoingOut: number;
    Health: number;
    LatestScore: number;
};

const GouniPrediction: React.FC<Props> = ({ profile }) => {
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
    const [show, setShow] = useState(false);
    const [total, setTotal] = useState(0);
    const [predictions, setPredictions] = useState<number[]>([]);
    const [formInfo, setFormInfo] = useState<UserInformation | null>(null);
    const [open, setOpen] = useState(false);
    const [loadingIcon, setLoadingIcon] = useState(false);
    const [predicting, setPredicting] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [saveCallback, setSaveCallback] = useState<(() => void) | null>(null);

    if (!profile || profile == undefined || profile.id == undefined) {
        return <>Vui lòng thiết lập thông tin cá nhân để sử dụng chức năng này</>;
    }

    useEffect(() => {
        const getSubject = async () => {
            if (profile.id) {
                const res = await getSubjectUser(profile.id);
                if (res.status.success) {
                    setSubjects(res.data[0]);
                }
            }
        };
        getSubject();
    }, []);

    useEffect(() => {
        const totalScore = predictions.reduce((acc, score) => acc + score, 0);
        setTotal(totalScore);
    }, [predictions]);

    const getPredictRequest = async (subject_id: number) => {
        const res = await getPredictionRequest({ subject_id });
        if (res.status.success) {
            return res.data[0];
        }
        return null;
    };

    const openFormInfo = (callback: () => void) => {
        setOpen(true);
        setSaveCallback(() => callback); 
    };

    const saveFormInfo = (values: UserInformation) => {
        setFormInfo(values);
        setOpen(false);
        if (saveCallback) {
            saveCallback(); 
        }
    };

    const handlePredict = async () => {
        if (!formInfo) {
            openFormInfo(handlePredict); 
            return;
        }
        setLoading(true);
        setLoadingIcon(true);

        const predictionsArray: number[] = [];
        for (let i = 0; i < subjects.length; i++) {
            try {
                const predictRequest: PredictRequest | any = await getPredictRequest(subjects[i].id);
                if (predictRequest.ExercisesCompleted == 0 && predictRequest.TestsCompleted == 0) {
                    continue;
                }
                const headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('x-api-key', process.env.NEXT_PUBLIC_API_KEY || '');

                const response = await fetch('http://127.0.0.1:5000/api/v1/predict', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(predictRequest),
                });
                const data = await response.json();
                const predictionScore = data.prediction[0];
                predictionsArray.push(predictionScore);

                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error('Error:', error);
            }
        }

        setPredictions(predictionsArray);
        setLoading(false);
        setLoadingIcon(false);
        setShow(true);
        setPredicting(false);
    };

    const handlePredictAgain = () => {
        setModalVisible(false);
        setShow(false);
        setPredicting(true);
    };

    const showModal = () => {
        setModalVisible(true);
    };

    const handleOk = () => {
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <>
            {show ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-primary">Hiệu suất ôn tập</h2>
                    <PerformanceIndicator score={total} />
                    <div className="mt-13md">Tổng điểm dự đoán: {total}</div>
                    <button className='border bg-primary text-white px-4 py-2 rounded-lg hover:bg-slate-200 transition-all mt-4 ml-4' onClick={showModal}>
                        Xem dự đoán chi tiết
                    </button>
                    <button className='border bg-primary text-white px-4 py-2 rounded-lg hover:bg-slate-200 transition-all mt-4' onClick={handlePredictAgain}>
                        <ReloadOutlined className="mr-2" /> Dự đoán lại
                    </button>
                </div>
            ) : (
                <button className='border bg-primary text-white px-20xs md:px-20md py-10xs md:py-10md rounded hover:bg-slate-200 transition-all' onClick={handlePredict}>
                    {loading ? (
                        <>
                            <LoadingOutlined style={{ marginRight: 8 }} />
                            <span className="ml-2">Đang phân tích số liệu...</span>
                        </>
                    ) : (
                        'Xem dự đoán ôn luyện từ GouniAI'
                    )}
                </button>
            )}

            <Modal
                title="Chi tiết dự đoán"
                open={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Đóng
                    </Button>
                ]}
            >
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">Hiệu suất ôn tập</h2>
                    <PerformanceIndicator score={total} />
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Dự đoán điểm từng môn học</h3>
                        <div className="bg-white rounded-lg overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {subjects.map((value, index) => (
                                    <li key={value.id} className="px-4 py-3 flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-lg font-medium text-primary">{value.name}</p>
                                            <p className="text-sm text-gray-600">{predictions[index] ?? 'Chưa đủ dữ liệu để dự đoán'}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-xs text-gray-500">Đánh giá hiệu suất</span>
                                            <span className="ml-2 text-gray-700">
                                                <Performance10 score={predictions[index]} />
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <button className='border bg-primary text-white px-4 py-2 rounded-lg hover:bg-slate-200 transition-all mt-4' onClick={handlePredictAgain}>
                        <ReloadOutlined className="mr-2" /> Dự đoán lại
                    </button>
                </div>
            </Modal>

            <Drawer
                title="Vui lòng cung cấp thêm thông tin"
                placement="right"
                closable={true}
                onClose={() => setOpen(false)}
                open={open}
            >
                <Form layout="vertical" onFinish={saveFormInfo}>
                    <Form.Item
                        label="Thời gian học mỗi ngày"
                        name="StudyTime"
                        rules={[{ required: true, message: 'Vui lòng nhập thời gian học' }]}
                    >
                        <InputNumber min={0} className="w-full" placeholder="Nhập số giờ học mỗi tuần" />
                    </Form.Item>
                    <Form.Item
                        label="Luyện thi online"
                        name="OnlineCourse"
                        rules={[{ required: true, message: 'Bạn có luyện thi online hay không' }]}
                    >
                        <Radio.Group>
                            <Radio value="yes">Có</Radio>
                            <Radio value="no">Không</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="Loại trường"
                        name="SchoolType"
                        rules={[{ required: true, message: 'Vui lòng chọn loại trường' }]}
                    >
                        <Select placeholder="Chọn loại trường">
                            <Select.Option value="private">Tư thục</Select.Option>
                            <Select.Option value="public">Công lập</Select.Option>
                            <Select.Option value="specialized">Trường chuyên</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Loại lớp học"
                        name="ClassType"
                        rules={[{ required: true, message: 'Vui lòng chọn loại lớp học' }]}
                    >
                        <Select placeholder="Chọn loại lớp học">
                            <Select.Option value="gifted">Lớp chọn</Select.Option>
                            <Select.Option value="normal">Lớp thường</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Tần suất tự học"
                        name="SelfStudy"
                        rules={[{ required: true, message: 'Vui lòng chọn tần suất tự học' }]}
                    >
                        <Select placeholder="Chọn tần suất tự học">
                            <Select.Option value={1}>1 - Rất ít</Select.Option>
                            <Select.Option value={2}>2 - Ít</Select.Option>
                            <Select.Option value={3}>3 - Bình thường</Select.Option>
                            <Select.Option value={4}>4 - Nhiều</Select.Option>
                            <Select.Option value={5}>5 - Rất nhiều</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Tần suất đi chơi với bạn bè"
                        name="GoingOut"
                        rules={[{ required: true, message: 'Vui lòng chọn tần suất đi chơi' }]}
                    >
                        <Select placeholder="Chọn tần suất đi chơi">
                            <Select.Option value={1}>1 - Rất ít</Select.Option>
                            <Select.Option value={2}>2 - Ít</Select.Option>
                            <Select.Option value={3}>3 - Bình thường</Select.Option>
                            <Select.Option value={4}>4 - Nhiều</Select.Option>
                            <Select.Option value={5}>5 - Rất nhiều</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Tình trạng sức khỏe chung"
                        name="Health"
                        rules={[{ required: true, message: 'Vui lòng chọn tình trạng sức khỏe' }]}
                    >
                        <Select placeholder="Chọn tình trạng sức khỏe">
                            <Select.Option value={1}>1 - Rất kém</Select.Option>
                            <Select.Option value={2}>2 - Kém</Select.Option>
                            <Select.Option value={3}>3 - Bình thường</Select.Option>
                            <Select.Option value={4}>4 - Tốt</Select.Option>
                            <Select.Option value={5}>5 - Rất tốt</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu thông tin
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};

export default GouniPrediction;
