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
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

//columns

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

const Product = () => {
  const [form] = Form.useForm();
  const [formAddProduct] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [brands, setBrands] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionPurpose, setModalActionPurpose] = useState('');
  const CREATE_PURPOSE = 'CREATE_PURPOSE';
  const UPDATE_PURPOSE = 'UPDATE_PURPOSE';
  const UPLOAD_API_URL = process.env.REACT_APP_API_BASE_URL + 'upload';

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const pageSize = 0;
  const [offset, setOffset] = useState(0);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e?.target?.value ? [e?.target?.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput?.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: 'orange',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text?.toString() : ''}
        />
      ) : (
        text
      ),
  });

  //hiển thị modal
  const showModal = async () => {
    await getAllBrands();
    setIsModalOpen(true);
    formAddProduct.resetFields();
    setModalActionPurpose(CREATE_PURPOSE);
  };

  const showEditModal = async ({ _id }) => {
    try {
      const { product } = await axiosClient.get(`product/get-by-id?id=${_id}`);
      product.variances = await Promise.all(
        product.variances.map((variance) => {
          return { ...variance, color: { label: variance.colorName, value: variance.color } };
        })
      );
      formAddProduct.setFieldsValue({ ...product, brandId: product?.brand?._id });

      let varianceLabels = [];
      let varianceImages = [];
      product?.variances?.forEach((variance) => {
        varianceLabels.push(variance?.colorName);
        varianceImages.push(variance?.images);
      });
      await getAllBrands();
      setVarianceCollapsedLabel(varianceLabels);
      setFileList(varianceImages);
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
    axiosClient.post('upload/delete', { unUsedFiles: [...unUsedFileList] }).catch((error) => {});
    setFileList([]);
    setIsModalOpen(false);
    setVarianceCollapsedLabel([]);
    setUnUsedFileList([]);
  };

  // Hàm xóa dựa trên customId
  const deleteProduct = async ({ _id }) => {
    try {
      // Gửi yêu cầu DELETE để xóa
      await axiosClient.delete(`product/delete/${_id}`);
      message.success('Xóa thành công.');
      getAllProducts(); // Cập nhật danh sách sau khi xóa
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
          getAllProducts();
        } catch (error) {
          messageApi.error('Tạo thất bại thành công');
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateProduct = () => {
    formAddProduct
      .validateFields()
      .then(async (formValue) => {
        await Promise.all(
          formValue.variances.map((variance, index) => {
            let images = fileList[index];
            console.log(images);
            if (images) {
              images = images.map((image) => {
                return image.status === 'done' ? image?.response : image;
              });
              variance['images'] = images;
            }
            let selectedColor = variance?.color;
            variance['color'] = selectedColor?.value?.toLowerCase();
            variance['colorName'] = selectedColor?.label;
            return variance;
          })
        );
        try {
          await axiosClient.put(`product/update/${formValue._id}`, formValue);
          messageApi.success('Cập nhật thành công.');
          setIsModalOpen(false);
          getAllProducts();
        } catch (error) {
          messageApi.success('Cập nhật thất bại.');
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getAllProducts();
  }, []);

  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const result = await axiosClient.get(`product/get-all?offset=${offset}&pageSize=${pageSize}`);
      if (result) {
        setProducts(result.products);
      }
    } catch (error) {
      console.log(error);
    }
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
  const columns = [
    {
      title: 'Tên',
      width: 200,
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
      render: (title) => (
        <span
          style={{ color: 'black', fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: 16 }}
        >
          {title}
        </span>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      // ...getColumnSearchProps('price'),
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['descend', 'ascend'],
      render: (price) => (
        <span>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
        </span>
      ),
    },
    {
      title: 'Thương Hiệu',
      dataIndex: 'brand',
      key: 'brand',
      width: 100,
      render: (data) => <span style={{ color: 'black' }}>{data?.name}</span>,
    },
    {
      title: 'Tùy chọn',
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
                Chi tiết sản phẩm
              </Menu.Item>

              <Menu.Item
                key="2"
                icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                style={{ color: '#FF4D4F' }}
                onClick={() => {
                  Modal.confirm({
                    title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
                    okText: 'Có',
                    okType: 'danger',
                    cancelText: 'Không',
                    onOk() {
                      deleteProduct(record);
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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [unUsedFileList, setUnUsedFileList] = useState([]);
  const [messageApi, messageContextHolder] = message.useMessage();

  const handleCancelPreview = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    await setPreviewImage(file.url || file.preview);
    await setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    setPreviewOpen(true);
  };

  const [varianceCollapsedLabel, setVarianceCollapsedLabel] = useState([]);
  const handleUploadImage = async (newFileList, varianceIndex) => {
    let newFile = newFileList.file;
    let selectedVarianceImages = newFileList.fileList;
    let changedFileList = [...fileList];
    if (newFile.status === 'error') {
      selectedVarianceImages = await Promise.all(
        selectedVarianceImages.filter((file) => file.status !== 'error')
      );
      changedFileList[varianceIndex] = selectedVarianceImages;
      messageApi.error('Lỗi khi tải ảnh lên.');
      setFileList(changedFileList);
      return;
    }

    selectedVarianceImages = await Promise.all(
      selectedVarianceImages.map((file) => {
        if (file.status === 'done') {
          file['url'] = file.response.url;
          file['name'] = file.response.name;
        }
        return file;
      })
    );

    changedFileList[varianceIndex] = selectedVarianceImages;
    setFileList(changedFileList);
    if (newFile.status === 'done') {
      let newUnUsedFileList = [...unUsedFileList];
      newUnUsedFileList.push(newFile.response.name);
      setUnUsedFileList(newUnUsedFileList);
    }
  };

  const handleDeleteImage = async (file) => {
    try {
      await axiosClient.get(`upload/delete/${file.name}`);
      messageApi.success('Xóa ảnh thành công.');
      return true;
    } catch (error) {
      messageApi.error('Lỗi khi xóa hình ảnh');
      return false;
    }
  };
  // const colorOptions = [
  //   {
  //     value: 'Black',
  //     label: 'Đen',
  //   },
  //   {
  //     value: 'White',
  //     label: 'Trắng',
  //   },
  //   {
  //     value: 'Red',
  //     label: 'Đỏ',
  //   },
  //   {
  //     value: 'Blue',
  //     label: 'Xanh biển',
  //   },
  //   {
  //     value: 'Yellow',
  //     label: 'Vàng',
  //   },
  //   {
  //     value: 'Green',
  //     label: 'Xanh lá',
  //   },
  //   {
  //     value: 'Pink',
  //     label: 'Hồng',
  //   },
  //   {
  //     value: 'Brown',
  //     label: 'Nâu',
  //   },
  //   {
  //     value: 'Orange',
  //     label: 'Cam',
  //   },
  //   {
  //     value: 'Beige',
  //     label: 'Be',
  //   },
  //   {
  //     value: 'Grey',
  //     label: 'Xám',
  //   },
  //   {
  //     value: 'Chocolate',
  //     label: 'Nâu Chocolate',
  //   },
  //   {
  //     value: 'DarkBlue',
  //     label: 'Xanh biển đậm',
  //   },
  //   {
  //     value: 'DarkOrange',
  //     label: 'Cam đậm',
  //   },
  //   {
  //     value: 'DarkGreen',
  //     label: 'Xanh lá đậm',
  //   },
  //   {
  //     value: 'GreenYellow',
  //     label: 'Xanh nõn chuối',
  //   },
  //   {
  //     value: 'Silver',
  //     label: 'Bạc',
  //   },
  // ];

  return (
    <>
      {messageContextHolder}
      <div className="px-5 py-5">
        <Button type="primary" onClick={showModal}>
          Thêm sản phẩm
        </Button>
        <Modal
          width={800}
          title="Sản phẩm"
          open={isModalOpen}
          onOk={() => {
            switch (modalActionPurpose) {
              case CREATE_PURPOSE:
                handleAddProduct();
                break;
              case UPDATE_PURPOSE:
                handleUpdateProduct();
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
              label="Tên Sản Phẩm"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền tên sản phẩm',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Giá"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền giá',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mô Tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền mô tả',
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Thương Hiệu"
              name="brandId"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền thương hiệu',
                },
              ]}
              initialValue={brands?.[0]?._id}
            >
              <Select
                options={brands?.map((brand) => {
                  return {
                    value: brand?._id,
                    label: brand?.name,
                  };
                })}
              />
            </Form.Item>

            <Form.Item label="Phân Loại" name="variances">
              <Form.List name="variances">
                {(fields, { add, remove }) => {
                  return (
                    <div
                      style={{
                        display: 'flex',
                        rowGap: 16,
                        flexDirection: 'column',
                      }}
                    >
                      {fields.map((field) => (
                        <Collapse defaultActiveKey="-1">
                          <Collapse.Panel
                            header={varianceCollapsedLabel[field.name]}
                            extra={
                              <AiOutlineClose
                                onClick={async (event) => {
                                  event.stopPropagation();
                                  let deletedVarianceCollapsedLabel = [...varianceCollapsedLabel];
                                  deletedVarianceCollapsedLabel.splice(field.name, 1);
                                  let deletedImage = [...fileList];
                                  deletedImage.splice(field.name, 1);
                                  await setVarianceCollapsedLabel(deletedVarianceCollapsedLabel);
                                  await setFileList(deletedImage);
                                  remove(field.name);
                                }}
                              />
                            }
                          >
                            <Form.Item
                              label="Tên màu"
                              name={[field.name, 'color']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng điền tên màu',
                                },
                              ]}
                            >
                              <Select
                                labelInValue={true}
                                showSearch
                                placeholder="Chọn màu"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  (option?.label ?? '').includes(input)
                                }
                                filterSort={(optionA, optionB) =>
                                  (optionA?.label ?? '')
                                    .toLowerCase()
                                    .localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                onChange={(value, option) => {
                                  if (!value) {
                                    value = 'Phân Loại Màu Mới';
                                  }
                                  let newVarianceCollapsedLabel = [...varianceCollapsedLabel];
                                  newVarianceCollapsedLabel[field.name] = option.label;
                                  setVarianceCollapsedLabel(newVarianceCollapsedLabel);
                                }}
                                options={[
                                  {
                                    value: 'Black',
                                    label: 'Đen',
                                  },
                                  {
                                    value: 'White',
                                    label: 'Trắng',
                                  },
                                  {
                                    value: 'Red',
                                    label: 'Đỏ',
                                  },
                                  {
                                    value: 'Blue',
                                    label: 'Xanh biển',
                                  },
                                  {
                                    value: 'Yellow',
                                    label: 'Vàng',
                                  },
                                  {
                                    value: 'Green',
                                    label: 'Xanh lá',
                                  },
                                  {
                                    value: 'Pink',
                                    label: 'Hồng',
                                  },
                                  {
                                    value: 'LightPink',
                                    label: 'Hồng nhạt',
                                  },
                                  {
                                    value: 'RosyBrown',
                                    label: 'Nâu phấn',
                                  },
                                  {
                                    value: 'Brown',
                                    label: 'Nâu',
                                  },
                                  {
                                    value: 'Orange',
                                    label: 'Cam',
                                  },
                                  {
                                    value: 'Beige',
                                    label: 'Be',
                                  },
                                  {
                                    value: 'Grey',
                                    label: 'Xám',
                                  },
                                  {
                                    value: 'Chocolate',
                                    label: 'Nâu Chocolate',
                                  },
                                  {
                                    value: 'DarkBlue',
                                    label: 'Xanh biển đậm',
                                  },
                                  {
                                    value: 'DarkOrange',
                                    label: 'Cam đậm',
                                  },
                                  {
                                    value: 'DarkGreen',
                                    label: 'Xanh lá đậm',
                                  },
                                  {
                                    value: 'GreenYellow',
                                    label: 'Xanh nõn chuối',
                                  },
                                  {
                                    value: 'Silver',
                                    label: 'Bạc',
                                  },
                                  {
                                    value: 'Tan',
                                    label: 'Nâu tan',
                                  },
                                ]}
                              />
                            </Form.Item>

                            <Form.Item label="Hình Ảnh">
                              <Upload
                                action={UPLOAD_API_URL}
                                listType="picture-card"
                                fileList={fileList[field.name]}
                                onPreview={handlePreview}
                                onChange={(file) => handleUploadImage(file, field.name)}
                                onRemove={handleDeleteImage}
                              >
                                <div>
                                  <AiOutlinePlus />
                                  <div
                                    style={{
                                      marginTop: 8,
                                    }}
                                  >
                                    Thêm Ảnh
                                  </div>
                                </div>
                              </Upload>
                              <Modal
                                open={previewOpen}
                                // title={previewTitle}
                                footer={null}
                                onCancel={handleCancelPreview}
                              >
                                <img
                                  alt="example"
                                  style={{
                                    width: '100%',
                                  }}
                                  src={previewImage}
                                />
                              </Modal>
                            </Form.Item>
                            {/* Nest Form.List */}
                            <Form.Item label="Kích Thước Và Số Lượng">
                              <Form.List name={[field.name, 'varianceDetail']}>
                                {(subFields, subOpt) => (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      rowGap: 16,
                                    }}
                                  >
                                    {subFields.map((subField) => (
                                      <Space key={subField.key}>
                                        <Form.Item noStyle name={[subField.name, 'size']}>
                                          <InputNumber placeholder="Kích thước" />
                                        </Form.Item>
                                        <Form.Item noStyle name={[subField.name, 'quantity']}>
                                          <InputNumber placeholder="Số lượng" />
                                        </Form.Item>
                                        <AiOutlineClose
                                          onClick={() => {
                                            subOpt.remove(subField.name);
                                          }}
                                        />
                                      </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => subOpt.add()} block>
                                      + Thêm Kích Thước Và Số Lượng
                                    </Button>
                                  </div>
                                )}
                              </Form.List>
                            </Form.Item>
                          </Collapse.Panel>
                        </Collapse>
                      ))}
                      <Button
                        type="dashed"
                        onClick={async () => {
                          let varianceCollapsedLabels = [...varianceCollapsedLabel];
                          varianceCollapsedLabels.push('Phân Loại Màu Mới');
                          await setVarianceCollapsedLabel(varianceCollapsedLabels);
                          add();
                        }}
                        block
                      >
                        + Thêm Phân Loại
                      </Button>
                    </div>
                  );
                }}
              </Form.List>
            </Form.Item>
          </Form>
        </Modal>

        <Table pagination={{ pageSize: 7 }} columns={columns} dataSource={products} bordered />
      </div>
    </>
  );
};

export default Product;
