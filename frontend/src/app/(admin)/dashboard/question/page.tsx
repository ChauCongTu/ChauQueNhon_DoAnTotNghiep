"use client"
import QuestionTable from '@/components/dashboard/question/table';
import { getQuestions } from '@/modules/questions/services';
import { QuestionType } from '@/modules/questions/types';
import { useAuth } from '@/providers/authProvider';
import { Button, Input, Pagination } from 'antd';
import React, { useEffect, useState } from 'react'

type Props = {}

const QuestionAdmin = (props: Props) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    fetchData();
  }, []);
  const handleChangePage = (page: number) => {
    fetchData(page);
  }
  const handleOnChange = (e: any) => {
    const q = e.target.value;
    console.log(q.length);
    fetchData(null, q);
  }
  const fetchData = (page?: number | null, search?: string | null) => {
    const params: { perPage: number; page?: number; q?: string } = { perPage: 12 };

    if (page !== undefined && page !== null) {
      params.page = page;
    }

    if (search !== undefined && search !== null) {
      params.q = search;
    }
    getQuestions(params).then((res) => {
      if (res.status && res.status.code === 200) {
        setQuestions(res.data[0].data);
        setCurrent(res.data[0].current_page);
        setTotal(res.data[0].total);
      }
    })
  }
  return (
    <div className='bg-white rounded mr-5xs md:mr-5md mt-5xs md:mt-5md'>
      <div className='px-10xs md:px-10md text-24xs md:text-24md font-bold border-b py-10xs md:py-10md'>Quản lý câu hỏi</div>
      <div className='px-10xs md:px-10md py-10xs md:py-10md'>
        {
          user
            ? <>
              <div className='mb-5xs md:mb-5md flex justify-between items-center'>
                <div className='w-280xs md:w-280md'><Input onChange={(e) => handleOnChange(e)} placeholder='Nhập mã/câu hỏi cần tìm' /></div>
                <div>
                  <Button>Thêm câu hỏi</Button>
                </div>
              </div>
              {
                questions && <QuestionTable loading={true} questions={questions} />
              }
              <div className="py-10xs md:py-10md flex justify-end">
                <Pagination current={current} total={total} pageSize={12} onChange={handleChangePage} hideOnSinglePage />
              </div>
            </>
            : <>Bạn không có quyền truy cập vào nguồn tài nguyên này</>
        }
      </div>
    </div>
  )
}

export default QuestionAdmin