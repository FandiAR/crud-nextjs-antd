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
        }, 5000);
        if (formType !== 'login') message.success('Registration successfull...:-)');
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
            ? 'Login to CrudReactJs'
            : 'Regist your CrudNextJs account'
        }
      </Title>
      <Form className="margin-top-4">
        <Text>Email</Text>
        <Form.Item
          name="email"
          rules={[
            { type: 'email' },
            { required: true, message: 'Email must be filled...' },
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

        <Text>Password</Text>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Password must be filled...' }]}
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
            text={formType === 'login' ? 'Login' : 'Register'}
            handleClick={handleSubmit}
          />
        </Form.Item>
        <Text className="padding-top-2">
          {formType === 'login' ? 'Dont have account? ' : 'Have account? '}
          <span>
            <Link role="presentation" onClick={handleClickLink}>
              {formType === 'login' ? 'Register' : 'Login'}
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
                <Spin tip="Brewing the coffee..." size="large" />
              </Modal>
            )
            : null
        }
      </Form>
    </div>
  );
};
export default FormEntry;
