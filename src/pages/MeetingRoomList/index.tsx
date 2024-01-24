import { Badge, Button, Form, Input, Table } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';

import { meetingRoomApiInterface } from '@/api';
import { MeetingRoom } from '@/api/autogen';
import CreateBookingModal from './CreateBookingModal';

interface SearchMeetingRoom {
  name: string;
  capacity: number;
  equipment: string;
}

const MeetingRoomList = () => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentMeetingRoom, setCurrentMeetingRoom] = useState<MeetingRoom>();

  const [meetingRoomResult, setMeetingRoomResult] = useState<Array<MeetingRoom>>([]);

  const columns: ColumnsType<MeetingRoom> = useMemo(
    () => [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '容纳人数',
        dataIndex: 'capacity',
      },
      {
        title: '位置',
        dataIndex: 'location',
      },
      {
        title: '设备',
        dataIndex: 'equipment',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '添加时间',
        dataIndex: 'createTime',
      },
      {
        title: '上次更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '预定状态',
        dataIndex: 'isBooked',
        render: (_, record) =>
          record.isBooked ? <Badge status="error">已被预订</Badge> : <Badge status="success">可预定</Badge>,
      },
      {
        title: '操作',
        render: (_, record) => (
          <div>
            <button
              onClick={() => {
                setCurrentMeetingRoom(record);
                setIsCreateModalOpen(true);
              }}
            >
              预定
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const searchMeetingRoom = useCallback(
    async (values: SearchMeetingRoom) => {
      const res = await meetingRoomApiInterface.meetingRoomControllerList(
        pageNo,
        pageSize,
        values.name,
        // @ts-ignore
        values.capacity,
        values.equipment
      );

      const { data } = res.data;
      if (res.status === HttpStatusCode.Ok && data) {
        const { meetingRooms, totalCount } = data;
        setMeetingRoomResult(
          meetingRooms.map(item => {
            return {
              key: item.id,
              ...item,
            };
          })
        );
        setTotalCount(totalCount);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [pageNo, pageSize]
  );

  const [form] = useForm();

  useEffect(() => {
    searchMeetingRoom({
      name: form.getFieldValue('name'),
      capacity: form.getFieldValue('capacity'),
      equipment: form.getFieldValue('equipment'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, pageSize]);

  const changePage = useCallback((pageNo: number, pageSize: number) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  return (
    <div id="meetingRoomList-container" className="p-20">
      <div className="mb-40">
        <Form form={form} onFinish={searchMeetingRoom} name="search" layout="inline" colon={false}>
          <Form.Item label="会议室名称" name="name">
            <Input />
          </Form.Item>

          <Form.Item label="容纳人数" name="capacity">
            <Input />
          </Form.Item>

          <Form.Item label="设备" name="equipment">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索会议室
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="meetingRoomList-table">
        <Table
          columns={columns}
          dataSource={meetingRoomResult}
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
      {currentMeetingRoom ? (
        <CreateBookingModal
          meetingRoom={currentMeetingRoom}
          isOpen={isCreateModalOpen}
          handleClose={() => {
            setIsCreateModalOpen(false);
          }}
        ></CreateBookingModal>
      ) : null}
    </div>
  );
};

export default MeetingRoomList;
