import {
  Button,
  Collapse,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Upload,
  message,
} from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineClose, AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import { axiosClient } from '../../api/axiosClient';
import AddBrandModal from './AddBrandModal';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [formValues, setFormValues] = useState({ name: '' });

  const { Search } = Input;

  const [searchText, setSearchText] = useState('');

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // open modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // closse modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // xử lý khi ấn nút "Thêm" trên modal
  const handleCreate = (values) => {
    // gửi dữ liệu thương hiệu lên máy chủ thông qua API
    // sau khi thêm thành công, cập nhật danh sách thương hiệu
    axiosClient
      .post('brand/add-new-brand', values)
      .then(() => {
        setIsModalVisible(false);
        message.success('Thêm thương hiệu thành công');
        // gọi hàm để cập nhật danh sách thương hiệu
        getAllBrands();
      })
      .catch((error) => {
        console.log(error);
        message.error('Lỗi khi thêm thương hiệu');
      });
  };

  const getAllBrands = async () => {
    try {
      const result = await axiosClient.get('brand/get-all-brands');
      if (result) {
        console.log(result);
        setBrands(result.brands);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBrands();
  }, []);

  const columns = [
    {
      title: 'Tên thương hiệu',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <span style={{ color: 'black', fontWeight: 'bold' }}>{name}</span>,
    },
    {
      title: 'Tùy chọn',
      align: 'center',
      key: 'action',
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
                icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                style={{ color: '#FF4D4F' }}
                onClick={() => {
                  Modal.confirm({
                    title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
                    okText: 'Có',
                    okType: 'danger',
                    cancelText: 'Không',
                    onOk() {
                      deleteBrand(record);
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

  const editBrand = (brand) => {
    // xử lý chức năng sửa thương hiệu (nếu cần)
  };

  const deleteBrand = (brand) => {
    try {
      // Gửi yêu cầu xóa thương hiệu bằng API
      axiosClient
        .delete(`brand/delete/${brand._id}`)
        .then(() => {
          message.success('Xóa thương hiệu thành công');
          // Sau khi xóa thành công, cập nhật danh sách thương hiệu
          getAllBrands();
        })
        .catch((error) => {
          console.log(error);
          message.error('Lỗi khi xóa thương hiệu');
        });
    } catch (error) {
      message.error('Xóa thất bại.');
      console.log(error);
    }
  };

  return (
    <div>
      <Button className="mr-5 mt-5 ml-5 mb-5" type="primary" onClick={showModal}>
        Thêm Thương Hiệu
      </Button>
      <Search
        type="primary"
        className="mr-5 mt-5 ml-96 mb-5"
        placeholder="Tìm kiếm thương hiệu"
        onSearch={handleSearch}
        style={{ width: 300 }}
      />
      <Table
        className=" ml-5 mr-5"
        tableLayout="auto"
        bordered="true"
        columns={columns}
        dataSource={filteredBrands}
        pagination={{ pageSize: 7 }}
      />

      <AddBrandModal visible={isModalVisible} onCreate={handleCreate} onCancel={handleCancel} />
    </div>
  );
};

export default Brand;
