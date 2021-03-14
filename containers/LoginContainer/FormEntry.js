import { useState } from 'react';
import {
  Form, Input, Spin, Modal,
} from 'antd';
import Router from 'next/router';
import { Link, Title, Text } from '../../components/Text';
import { Button, message } from '../../components';
import apiClient from '../../libs/apiClient';

const FormEntry = ({ formType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    let url = 'register';
    let path = '/';
    if (formType === 'login') {
      url = 'login';
      path = '/users';
    }

    apiClient('post', url, values)
      .then(() => {
        if (formType === 'login') setShowModal(true);
        setTimeout(() => {
          setIsLoading(false);
          setShowModal(false);
        }, 1000);
        if (formType !== 'login') message.success('Pendaftaran berhasil...:-)');
        Router.push(path);
      })
      .catch((error) => {
        setIsLoading(false);
        setShowModal(false);
        const errorMessage = error && error.response ? error.response.data.error : error.message;
        message.error(errorMessage);
      });
  };

  const handleClickLink = () => {
    if (formType === 'login') Router.push('/register');
    else Router.push('/');
  };

  return (
    <div className="login">
      <Title level={4}>
        {
          formType === 'login'
            ? 'Masuk ke CrudReactJs'
            : 'Daftarkan akun CrudNextJs kamu'
        }
      </Title>
      <Form className="margin-top-4">
        <Text>Email</Text>
        <Form.Item
          name="email"
          rules={[
            { type: 'email' },
            { required: true, message: 'Email harus di isi...' },
          ]}
        >
          <Input
            size="large"
            className="input"
            autoComplete="off"
            value={values.email}
            onChange={handleChange('email')}
          />
        </Form.Item>

        <Text>Kata Sandi</Text>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Kata sandi harus di isi...' }]}
        >
          <Input.Password
            size="large"
            className="input"
            value={values.password}
            onChange={handleChange('password')}
          />
        </Form.Item>
        <Form.Item>
          <Button
            isLoading={isLoading}
            text={formType === 'login' ? 'Masuk' : 'Daftar'}
            handleClick={handleSubmit}
          />
        </Form.Item>
        <Text className="padding-top-2">
          {formType === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <span>
            <Link role="presentation" onClick={handleClickLink}>
              {formType === 'login' ? 'Daftar' : 'Masuk'}
            </Link>
          </span>
        </Text>
        {
          isLoading && formType === 'login'
            ? (
              <Modal
                visible={showModal}
                footer={null}
                closable={false}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Spin tip="Menunggu..." size="large" />
              </Modal>
            )
            : null
        }
      </Form>
    </div>
  );
};
export default FormEntry;
