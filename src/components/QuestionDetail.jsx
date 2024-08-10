import {
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Table,
  Typography,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { axiosClient } from '../api/axiosClient';

const QuestionDetail = (props) => {
  const { isOpenModalQuestionDetail, setIsOpenModalQuestionDetail, selectedGame } = props;
  const [gameDetails, setGameDetails] = useState([]);
  const isEditing = (record) => record._id === editingKey;
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const columns = [
    {
      title: 'Câu hỏi',
      width: 200,
      dataIndex: 'cauhoi',
      key: 'cauhoi',
      inputType: 'text',
      editable: true,
    },
    {
      title: 'A',
      editable: true,
      dataIndex: 'a',
      key: 'a',
      inputType: 'text',
    },
    {
      title: 'B',
      editable: true,
      dataIndex: 'b',
      key: 'b',
      inputType: 'text',
    },
    {
      title: 'C',
      editable: true,
      dataIndex: 'c',
      key: 'c',
      inputType: 'text',
    },
    {
      title: 'D',
      editable: true,
      dataIndex: 'd',
      key: 'd',
      inputType: 'text',
    },
    {
      title: 'Đáp Án',
      editable: true,
      inputType: 'radio',
      dataIndex: 'dapan',
      key: 'dapan',
      radioValue: [
        { name: 'A', value: 'a' },
        { name: 'B', value: 'b' },
        { name: 'C', value: 'c' },
        { name: 'D', value: 'd' },
      ],
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>

            <Popconfirm title="Sure to delete?" onConfirm={() => deleteQuestion(record._id)}>
              <a className="ml-2">Delete</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const cancel = () => {
    setEditingKey('');
  };
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record._id);
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    radioValue,
    ...restProps
  }) => {
    let inputNode = null;
    if (inputType === 'text') {
      inputNode = <Input />;
    } else if (inputType === 'radio') {
      inputNode = (
        <Radio.Group>
          {radioValue.map((r) => (
            <Radio value={r.value}>{r.name}</Radio>
          ))}
        </Radio.Group>
      );
    } else {
      inputNode = <Input />;
    }
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        radioValue: col.radioValue,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const save = async (key) => {
    const updateQuestionIndex = gameDetails.findIndex((element) => {
      return element._id === key;
    });
    let games = [...gameDetails];
    let updatedGame = { _id: key, ...form.getFieldsValue() };
    games[updateQuestionIndex] = updatedGame;
    try {
      await axiosClient.put(`/game2/${selectedGame.customId}`, {
        ...selectedGame,
        game: games,
      });
      message.success('Cập nhật câu hỏi thành công.');
      getGameByCustomId();
      cancel();
    } catch (error) {
      message.error('Cập nhật câu hỏi thất bại.');
      console.log(error);
    }
  };

  const getGameByCustomId = async () => {
    try {
      const result = await axiosClient.get(`/game2/${selectedGame.customId}`);
      setGameDetails(result.game);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGameByCustomId();
  }, []);

  const deleteQuestion = async (key) => {
    const deleteQuestionIndex = gameDetails.findIndex((element) => {
      return element._id === key;
    });
    let games = [...gameDetails];
    games.splice(deleteQuestionIndex, 1);
    try {
      await axiosClient.put(`/game2/${selectedGame.customId}`, {
        ...selectedGame,
        game: games,
      });
      message.success('Xóa câu hỏi thành công.');
      getGameByCustomId();
      cancel();
    } catch (error) {
      message.error('Xóa câu hỏi thất bại.');
      console.log(error);
    }
  };
  return (
    <>
      <Modal
        title="Chi tiết sản phẩm"
        open={isOpenModalQuestionDetail}
        width={1200}
        // onOk={handleAddQuestion}
        onCancel={() => setIsOpenModalQuestionDetail(false)}
        okButtonProps={{ style: { display: 'none' } }}
        cancelText="Đóng"
      >
        <h3>ID: {selectedGame.customId}</h3>
        <h3>Tên Sự Kiện: {selectedGame.name}</h3>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{ pageSize: 10 }}
            style={{ marginTop: 20 }}
            dataSource={gameDetails}
            bordered
          />
        </Form>
      </Modal>
    </>
  );
};

export default QuestionDetail;
