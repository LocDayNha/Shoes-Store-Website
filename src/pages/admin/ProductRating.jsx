import { Button, Dropdown, Form, Menu, Modal, Select, Space, Table, Tag, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdDeleteOutline } from 'react-icons/md';
import { axiosClient } from '../../api/axiosClient';
import moment from 'moment';
import 'moment/locale/vi';
import { MdOutlineStar } from 'react-icons/md';

const ProductRating = () => {
  const [ratings, setRatings] = useState([]);
  const [averageStars, setAverageStars] = useState(0);
  const [visible, setVisible] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const showDeleteConfirm = (record) => {
    setRecordToDelete(record);
    setConfirmDeleteVisible(true);
  };

  const handleViewMedia = (url) => {
    setMediaUrl(url);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axiosClient.get('/ratingProduct/products/ratings');
        setRatings(response.ratings);
        calculateAverageStars(response.ratings);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchRatings();
  }, []);

  const calculateAverageStars = (data) => {
    const totalStars = data.reduce((acc, curr) => acc + curr.star, 0); // Tính tổng số sao
    const average = totalStars / data.length; // Tính số sao trung bình
    setAverageStars(average.toFixed(1)); // Cập nhật state với số sao trung bình
  };

  const renderStars = (star) => {
    const isRed = star <= 2; // Kiểm tra nếu số sao nhỏ hơn hoặc bằng 2
    const starColor = isRed ? '#FF0000' : '#DAA520'; // Màu sao dựa trên điều kiện

    return (
      <span>
        {Array.from({ length: star }, (_, i) => (
          <MdOutlineStar color={starColor} key={i} />
        ))}
      </span>
    );
  };

  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'idUser.name',
      key: 'idUser.name',
      render: (text, record) => record?.idUser?.name,
    },
    {
      title: 'Email người dùng',
      dataIndex: 'idUser.email',
      key: 'idUser.email',
      render: (text, record) => record?.idUser?.email,
    },
    {
      title: 'Nhận xét',
      dataIndex: 'ratingStatus',
      key: 'ratingStatus',
      render: (status) => <Tag>{status}</Tag>,
    },
    {
      title: 'Số sao',
      dataIndex: 'star',
      key: 'star',
      render: renderStars,
    },
    {
      title: 'Thời gian mua hàng',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => <span>{moment(record?.date).format('YYYY-MM-DD - HH:mm:ss')}</span>,
    },
    {
      title: 'Tùy chọn',
      align: 'center',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<MdDeleteOutline />} onClick={() => showDeleteConfirm(record)}>
            Xóa
          </Button>
          {record.image && (
            <Button icon={<AiOutlineInfoCircle />} onClick={() => handleViewMedia(record.image)}>
              Xem hình ảnh
            </Button>
          )}
          {/* {record.video && (
            <Button icon={<AiOutlineInfoCircle />} onClick={() => handleViewMedia(record.video)}>
              Xem video
            </Button>
          )} */}
        </Space>
      ),
    },
  ];

  const renderMedia = () => {
    if (mediaUrl) {
      if (mediaUrl.endsWith('.mp4')) {
        return (
          <video width="100%" height="auto" controls>
            <source src={mediaUrl} type="video/mp4" />
          </video>
        );
      } else {
        return <img src={mediaUrl} style={{ width: '100%', height: 'auto' }} />;
      }
    }
    return null;
  };

  const handleOk = async () => {
    try {
      if (recordToDelete) {
        // Gọi API để xóa đánh giá dựa trên ID
        await axiosClient.delete(`/ratingProduct/delete/${recordToDelete._id}`);
        message.success('Đánh giá đã được xóa thành công!');

        // Sau khi xóa, cập nhật lại danh sách đánh giá bằng cách fetch lại dữ liệu
        const response = await axiosClient.get('/ratingProduct/products/ratings');
        setRatings(response.ratings);
        calculateAverageStars(response.ratings);

        // Đóng modal xác nhận xóa
        setConfirmDeleteVisible(false);
        setRecordToDelete(null);
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi xóa đánh giá!');
    }
  };

  const handleCancelDelete = () => {
    setRecordToDelete(null);
    setConfirmDeleteVisible(false);
  };

  return (
    <div className="p-5 justify-center items-center content-center">
      <p className="pl-3">
        <h3>
          <strong>Đánh giá tổng: {averageStars} </strong>
          <MdOutlineStar color="#DAA520" />
        </h3>
      </p>
      <Table pagination={{ pageSize: 6 }} dataSource={ratings} columns={columns} rowKey="_id" />
      <Modal visible={visible} onCancel={handleCancel} footer={null}>
        {renderMedia()}
      </Modal>
      <Modal
        title="Xác nhận xóa"
        visible={confirmDeleteVisible}
        onOk={handleOk}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa đánh giá này?</p>
      </Modal>
    </div>
  );
};

export default ProductRating;
