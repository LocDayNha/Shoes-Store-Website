import { Button, Dropdown, Form, Input, Menu, Modal, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineStop } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import { axiosClient } from '../../api/axiosClient';

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const User = () => {
  const [user, setUser] = useState([]);
  const [formAddProduct] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionPurpose, setModalActionPurpose] = useState('');
  const CREATE_PURPOSE = 'CREATE_PURPOSE';
  const UPDATE_PURPOSE = 'UPDATE_PURPOSE';
  const { Search } = Input;
  const [searchText, setSearchText] = useState('');


  const handleSearch = (value) => {
    setSearchText(value);
  };
  const filteredName = user.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const getAllUsers = async () => {
    try {
      const result = await axiosClient.get('user/get-all?role=1');
      if (result) {
        setUser(result.user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Show thông tin User
  const showEditModal = async ({ _id }) => {
    try {
      const { user } = await axiosClient.get(`user/get-by-id?id=${_id}`);
      formAddProduct.setFieldsValue({
        ...user,
        name: user?.name,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        address: user?.address,
        gender: user?.gender,
      });
      setModalActionPurpose(UPDATE_PURPOSE);
      setIsModalOpen(true);
      setUnUsedFileList([]);
    } catch (error) {
      console.log(error);
      messageApi.error('Lỗi khi lấy thông tin sản phẩm.');
    }
  };

  const handleCancel = () => {
    formAddProduct.resetFields();
    // axiosClient.post('upload/delete', { unUsedFiles: [...unUsedFileList] }).catch((error) => {});
    setFileList([]);
    setIsModalOpen(false);
    setVarianceCollapsedLabel([]);
    setUnUsedFileList([]);
  };

  // Xoá User theo ID
  const deleteUserById = async ({ _id }) => {
    try {
      await axiosClient.delete(`user/delete/${_id}`);
      message.success('Xóa thành công.');
      getAllUsers(); // Cập nhật danh sách sự kiện game sau khi xóa
    } catch (error) {
      message.error('Xóa thất bại.');
      console.log(error);
    }
  };

  //add
  const handleAddProduct = () => {
    formAddProduct
      .validateFields()
      .then(async (formValue) => {
        await Promise.all(
          formValue.variances.map((variance, index) => {
            let images = fileList[index];
            if (images) {
              images = images.map((image) => {
                return image?.response;
              });
              variance['images'] = images;
            }
            let selectedColor = variance?.color;
            variance['color'] = selectedColor.value.toLowerCase();
            variance['colorName'] = selectedColor.label;
            return variance;
          })
        );
        try {
          await axiosClient.post('product', formValue);
          messageApi.success('Tạo thành công');
          setIsModalOpen(false);
          getAllUsers();
        } catch (error) {
          messageApi.error('Tạo thất bại thành công');
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Cập nhật thông tin người dùng
  const handleUpdateUser = () => {
    formAddProduct
      .validateFields()
      .then(async (formValue) => {
          if (user) {
            user.name = formValue.name;
            user.email = formValue.email;
            user.phoneNumber = formValue.phoneNumber;
            user.address = formValue.address;
            user.gender = formValue.gender;
          }
        try {
          await axiosClient.post(`user/update`, formValue);
          messageApi.success('Cập nhật thành công.');
          setIsModalOpen(false);
          getAllUsers();
        } catch (error) {
          messageApi.error('Cập nhật thất bại.');
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const columns = [
    {
      title: 'Họ và tên',
      width: 100,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 100,
    },
    {
      title: 'Sổ điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 100,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 200,
    },

    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 5,
      render: (text, record) => (
        <Dropdown
          placement="bottom"
          arrow={{
            pointAtCenter: true,
          }}
          overlay={
            <Menu>
              <Menu.Item
                key="1"
                icon={<AiOutlineEdit size={15} color="#1890FF" />}
                style={{ color: '#1890FF' }}
                onClick={() => showEditModal(record)}
              >
                Sửa thông tin
              </Menu.Item>
              {/* {
                isActive ?
                ( <Menu.Item
                  key="2"
                  icon={<AiOutlineStop size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => disableAccount(record)}
                >
                 Bỏ Chặn 
                </Menu.Item>)
                :
                ( <Menu.Item
                  key="2"
                  icon={<AiOutlineStop size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => enableAccount(record)}
                >
                 Chặn
                </Menu.Item>)
              } */}
              <Menu.Item
                key="3"
                icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                style={{ color: '#FF4D4F' }}
                onClick={() => {
                  Modal.confirm({
                    title: 'Bạn có chắc chắn muốn xóa người dùng này?',
                    okText: 'Có',
                    okType: 'danger',
                    cancelText: 'Không',
                    onOk() {
                      deleteUserById(record);
                    },
                  });
                }}
              >
                Xoá
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button
            icon={
              <MdMoreHoriz
                style={{
                  verticalAlign: 'middle',
                  marginBottom: '1px',
                }}
                size={20}
              />
            }
          ></Button>
        </Dropdown>
      ),
    },
  ];

  const [fileList, setFileList] = useState([]);
  const [unUsedFileList, setUnUsedFileList] = useState([]);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [varianceCollapsedLabel, setVarianceCollapsedLabel] = useState([]);

  return (
    <>
      {messageContextHolder}
      <div className="px-5 py-5">
        <Modal
          width={600}
          title="Cập nhật thông tin "
          open={isModalOpen}
          onOk={() => {
            switch (modalActionPurpose) {
              case CREATE_PURPOSE:
                handleAddProduct();
                break;
              case UPDATE_PURPOSE:
                handleUpdateUser();
              default:
                break;
            }
          }}
          onCancel={handleCancel}
        >
          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            labelAlign="left"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={formAddProduct}
          >
            <Form.Item hidden={true} name="_id">
              <Input />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền họ và tên',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền giới tính ',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền email',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền số điện thoại',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền địa chỉ',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        <Search
        type="primary"
        placeholder="Tìm kiếm tên người dùng"
        onSearch={handleSearch}
        style={{ width: 300}}
        />
        <Table
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 20 }}
          columns={columns}
          dataSource={filteredName}
          bordered
        />
      </div>
    </>
  );
};

export default User;
