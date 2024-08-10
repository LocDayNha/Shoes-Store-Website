import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';

const AddBrandModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Thêm Thương Hiệu Mới"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onCreate(values);
          form.resetFields();
        });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="name"
          label="Tên Thương Hiệu"
          rules={[{ required: true, message: 'Vui lòng điền tên thương hiệu' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddBrandModal;
