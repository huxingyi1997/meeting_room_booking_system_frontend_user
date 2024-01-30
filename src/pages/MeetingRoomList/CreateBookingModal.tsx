import { DatePicker, Form, Input, Modal, TimePicker, message } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { MeetingRoom } from '@/api/autogen';
import { bookingApiInterface } from '@/api';
import { HttpStatusCode } from 'axios';
import dayjs from 'dayjs';
import { useCallback } from 'react';

interface CreateBookingModalProps {
  isOpen: boolean;
  handleClose: Function;
  meetingRoom: MeetingRoom;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface CreateBooking {
  rangeStartDate: Date;
  rangeStartTime: Date;
  rangeEndDate: Date;
  rangeEndTime: Date;
  note: string;
}

const CreateBookingModal = (props: CreateBookingModalProps) => {
  const [form] = useForm<CreateBooking>();

  const handleOk = useCallback(async () => {
    const values = form.getFieldsValue();

    const { rangeStartDate, rangeStartTime, rangeEndDate, rangeEndTime, note } = values;
    const meetingRoomId = props.meetingRoom.id;
    const rangeStartDateStr = dayjs(rangeStartDate).format('YYYY-MM-DD');
    const rangeStartTimeStr = dayjs(rangeStartTime).format('HH:mm');
    const startTime = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf();

    const rangeEndDateStr = dayjs(rangeEndDate).format('YYYY-MM-DD');
    const rangeEndTimeStr = dayjs(rangeEndTime).format('HH:mm');
    const endTime = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf();

    const res = await bookingApiInterface.bookingControllerAdd({
      meetingRoomId,
      startTime,
      endTime,
      note,
    });

    if (res.status === HttpStatusCode.Ok) {
      message.success('预定成功');
      form.resetFields();
      props.handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal title="创建会议室" open={props.isOpen} onOk={handleOk} onCancel={() => props.handleClose()} okText={'创建'}>
      <Form form={form} colon={false} {...layout}>
        <Form.Item label="会议室名称" name="meetingRoomId">
          {props.meetingRoom.name}
        </Form.Item>
        <Form.Item
          label="预定开始日期"
          name="rangeStartDate"
          rules={[{ required: true, message: '请输入预定开始日期!' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="预定开始时间"
          name="rangeStartTime"
          rules={[{ required: true, message: '请输入预定开始日期!' }]}
        >
          <TimePicker />
        </Form.Item>
        <Form.Item
          label="预定结束日期"
          name="rangeEndDate"
          rules={[{ required: true, message: '请输入预定结束日期!' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="预定结束时间"
          name="rangeEndTime"
          rules={[{ required: true, message: '请输入预定结束日期!' }]}
        >
          <TimePicker />
        </Form.Item>
        <Form.Item label="备注" name="note">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBookingModal;
