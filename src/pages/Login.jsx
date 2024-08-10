import React from 'react';
import '../../src/css/Login.css';
import { Form, Input, Button, Typography, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { axiosClient } from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form] = Form.useForm();
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // const dangNhapNe = async () => {
  //   try {
  //     const user = await axiosClient.post("/user/login", { email: email, password: password });
  //     console.log(">>>>>>>" + user);
  //     if (user.returnData.error === false) {
  //         setEmail(user.email);
  //         setPassword(user.password);
  //       messageApi.success('Đăng nhập thành công.');
  //     } else {
  //       messageApi.success('Đăng nhập thất bại.');
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  // navigate("/admin/product");

  // const onLogin = (values) => {
  //   axiosClient
  //     .post('/user/login', values)
  //     .then(async (response) => {
  //       if(response.role < 100){
  //         message.error('Đăng nhập thất bại ');
  //       }else{
  //         console.log('Login successful');
  //         message.success('Đăng nhập thành công');
  //         navigate('/admin/product');
  //       }

  //     })
  //     .catch((error) => {
  //       message.error('Đăng nhập thất bại ');
  //       console.error('Login failed');
  //     });
  // };

  const onLogin = async (values) => {
    try {
      const response = await axiosClient.post('/user/login', values);
      if (response.data.user.role < 100) {
        message.error('Đăng nhập thất bại');
      } else {
        console.log('Login successful');
        message.success('Đăng nhập thành công');
        navigate('/admin/product');
      }
    } catch (error) {
      message.error('Đăng nhập thất bại');
      console.error('Login failed', error);
    }
  };

  return (
    <div className="appBg">
      <Form className="loginForm" onFinish={onLogin} form={form}>
        <Typography.Title style={{ textAlign: 'center' }}>LOGIN</Typography.Title>
        <Form.Item
          name={'email'}
          rules={[{ required: true, type: 'email', message: 'Please input your username!' }]}
        >
          <Input placeholder="Enter your email" prefix={<UserOutlined />}/>
        </Form.Item>
        <Form.Item
          name={'password'}
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter your password"  />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
