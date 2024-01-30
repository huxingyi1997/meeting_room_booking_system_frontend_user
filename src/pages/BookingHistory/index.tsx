import { Button, DatePicker, Form, Input, Popconfirm, Table, TimePicker, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { HttpStatusCode } from 'axios';
import dayjs from 'dayjs';

import { Booking, BookingStatusEnum, MeetingRoom } from '@/api/autogen';
import { bookingApiInterface } from '@/api';
import { StatusFilterArray, StatusMap } from './constant';

export interface SearchBooking {
  username: string;
  meetingRoomName: string;
  meetingRoomPosition: string;
  rangeStartDate: Date;
  rangeStartTime: Date;
  rangeEndDate: Date;
  rangeEndTime: Date;
}

interface BookingSearchResult extends Booking {
  key: number;
}

const getUserInfo = () => {
  const userInfoStr = localStorage.getItem('user_info');

  if (userInfoStr) {
    return JSON.parse(userInfoStr);
  }
};

const BookingHistory = () => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [bookingSearchResult, setBookingSearchResult] = useState<Array<BookingSearchResult>>([]);
  const [num, setNum] = useState<number>(0);

  const searchBooking = useCallback(
    async (values: SearchBooking) => {
      const {
        username,
        meetingRoomName,
        meetingRoomPosition,
        rangeStartDate,
        rangeStartTime,
        rangeEndDate,
        rangeEndTime,
      } = values;
      let bookingTimeRangeStart;
      let bookingTimeRangeEnd;

      if (rangeStartDate && rangeStartTime) {
        const rangeStartDateStr = dayjs(rangeStartDate).format('YYYY-MM-DD');
        const rangeStartTimeStr = dayjs(rangeStartTime).format('HH:mm');
        bookingTimeRangeStart = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf();
      }

      if (rangeEndDate && rangeEndTime) {
        const rangeEndDateStr = dayjs(rangeEndDate).format('YYYY-MM-DD');
        const rangeEndTimeStr = dayjs(rangeEndTime).format('HH:mm');
        bookingTimeRangeEnd = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf();
      }
      const res = await bookingApiInterface.bookingControllerList(
        pageNo,
        pageSize,
        username,
        meetingRoomName,
        meetingRoomPosition,
        bookingTimeRangeStart,
        bookingTimeRangeEnd
      );
      const { data } = res.data;
      if (res.status === HttpStatusCode.Ok && data) {
        const { bookings, totalCount } = data;
        setBookingSearchResult(
          bookings.map(item => {
            return {
              key: item.id,
              ...item,
            };
          })
        );
        setTotalCount(totalCount);
      }
    },
    [pageNo, pageSize]
  );

  const changeStatus = useCallback(async (id: number) => {
    const res = await bookingApiInterface.bookingControllerUnbind(id);
    if (res.status === HttpStatusCode.Ok) {
      message.success('状态更新成功');
      setNum(Math.random());
    }
  }, []);

  const changePage = useCallback((pageNo: number, pageSize: number) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  const columns: ColumnsType<BookingSearchResult> = useMemo(
    () => [
      {
        title: '会议室名称',
        dataIndex: 'room',
        key: 'room',
        render(room: MeetingRoom) {
          return room?.name;
        },
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render(startTime: string) {
          return dayjs(new Date(startTime)).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render(endTime: string) {
          return dayjs(new Date(endTime)).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '审批状态',
        dataIndex: 'status',
        key: 'status',
        onFilter: (value, record) => record.status === (value as string),
        filters: [...StatusFilterArray],
        render(status: BookingStatusEnum) {
          return StatusMap.get(status);
        },
      },
      {
        title: '预定时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render(createTime: string) {
          return dayjs(new Date(createTime)).format('YYYY-MM-DD hh:mm:ss');
        },
      },
      {
        title: '备注',
        dataIndex: 'note',
        key: 'note',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        render: (id: number, record) =>
          record.status === BookingStatusEnum.Progressing ? (
            <div>
              <Popconfirm
                title="解除申请"
                description="确认解除吗？"
                onConfirm={() => changeStatus(id)}
                okText="Yes"
                cancelText="No"
              >
                <button>解除预定</button>
              </Popconfirm>
            </div>
          ) : null,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [form] = useForm();

  useEffect(() => {
    searchBooking({
      username: getUserInfo().username,
      meetingRoomName: form.getFieldValue('meetingRoomName'),
      meetingRoomPosition: form.getFieldValue('meetingRoomPosition'),
      rangeStartDate: form.getFieldValue('rangeStartDate'),
      rangeStartTime: form.getFieldValue('rangeStartTime'),
      rangeEndDate: form.getFieldValue('rangeEndDate'),
      rangeEndTime: form.getFieldValue('rangeEndTime'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, pageSize, num]);
  return (
    <div id="bookingHistory-container" className="p-5">
      <div className="mb-10">
        <Form form={form} onFinish={searchBooking} name="search" layout="inline" colon={false}>
          <Form.Item label="会议室名称" name="meetingRoomName">
            <Input />
          </Form.Item>

          <Form.Item label="预定开始日期" name="rangeStartDate">
            <DatePicker />
          </Form.Item>

          <Form.Item label="预定开始时间" name="rangeStartTime">
            <TimePicker />
          </Form.Item>

          <Form.Item label="预定结束日期" name="rangeEndDate">
            <DatePicker />
          </Form.Item>

          <Form.Item label="预定结束时间" name="rangeEndTime">
            <TimePicker />
          </Form.Item>

          <Form.Item label="位置" name="meetingRoomPosition">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索预定历史
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="bookingHistory-table">
        <Table
          columns={columns}
          dataSource={bookingSearchResult}
          pagination={{
            showSizeChanger: true,
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
            pageSizeOptions: [10, 20, 50],
            total: totalCount,
          }}
        />
      </div>
    </div>
  );
};

export default BookingHistory;
