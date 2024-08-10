import React, { useEffect, useState } from 'react';
import { Space, Table, Dropdown, Modal, Button, Checkbox, Form, Input, message, Radio } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { axiosClient } from '../../api/axiosClient';
import FormItem from 'antd/es/form/FormItem';

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

//columns
const columns = [
  {
    title: 'Câu hỏi',
    width: 200,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Đáp án',
    width: 50,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
  },
  {
    title: 'A',
    dataIndex: 'address',
    key: '1',
    width: 100,
  },
  {
    title: 'B',
    dataIndex: 'address',
    key: '1',
    width: 100,
  },
  {
    title: 'C',
    dataIndex: 'address',
    key: '1',
    width: 100,
  },
  {
    title: 'D',
    dataIndex: 'address',
    key: '1',
    width: 100,
  },

  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 50,
    render: () => (
      <Space size="middle">
        <Dropdown
          menu={{
            items,
          }}
        >
          <a>
            Thêm <DownOutlined />
          </a>
        </Dropdown>
      </Space>
    ),
  },
];

//data
const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

//2 optional xóa và sửa trong cột Action
const items = [
  {
    key: '1',
    label: 'Sửa',
  },
  {
    key: '2',
    label: 'Xóa',
  },
];

const Question = (props) => {
  const [formAddProduct] = Form.useForm();
  const { isOpenModalAddQuestion, setIsOpenModalAddQuestion, selectedGame } = props;

  const handleOk = () => {
    // setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsOpenModalAddQuestion(false);
  };

  const handleAddQuestion = () => {
    formAddProduct
      .validateFields()
      .then(async (formValue) => {
        try {
          let data = {
            cauhoi: formValue.question,
            dapan: formValue.result,
            a: formValue.a,
            b: formValue.b,
            c: formValue.c,
            d: formValue.d,
          };
          const result = await axiosClient.post(
            `/game2/addQuestion/${selectedGame?.customId}`,
            data
          );
          formAddProduct.resetFields(['question', 'result', 'a', 'b', 'c', 'd']);
          message.success('Tạo câu hỏi thành công.');
        } catch (error) {
          console.log(error);
          message.error('Tạo câu hỏi không thành công.', 5);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    formAddProduct.setFieldsValue({ customId: selectedGame?.customId });
  }, []);

  return (
    <>
      <div>UserPage</div>;
      <Modal
        title="Thêm câu hỏi"
        open={isOpenModalAddQuestion}
        onOk={handleAddQuestion}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{
            span: 4,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={formAddProduct}
        >
          <Form.Item label="Mã Game" name="customId">
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Câu hỏi"
            name="question"
            rules={[
              {
                required: true,
                message: 'Vui lòng điền câu hỏi',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="a"
            name="a"
            rules={[
              {
                required: true,
                message: 'Vui lòng điền câu trả lời',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="b"
            name="b"
            rules={[
              {
                required: true,
                message: 'Vui lòng điền câu trả lời',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="c"
            name="c"
            rules={[
              {
                required: true,
                message: 'Vui lòng điền câu trả lời',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="d"
            name="d"
            rules={[
              {
                required: true,
                message: 'Vui lòng điền câu trả lời',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Đáp án"
            name="result"
            rules={[
              {
                required: true,
                message: 'Vui lòng điền câu trả lời',
              },
            ]}
          >
            <Radio.Group>
              <Radio value="a"> A </Radio>
              <Radio value="b"> B </Radio>
              <Radio value="c"> C </Radio>
              <Radio value="d"> D </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Question;
