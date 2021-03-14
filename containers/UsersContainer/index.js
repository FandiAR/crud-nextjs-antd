import { useEffect, useState, useRef } from 'react';
import {
  Avatar, Layout, Tooltip, Popconfirm, message,
  Table, Input, Form, Row, Col,
} from 'antd';
import { Link } from '../../components/Text';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined, DeleteOutlined, EditOutlined, LogoutOutlined,
} from '@ant-design/icons';
import apiClient from '../../libs/apiClient';
import { Button } from '../../components';
import { Title } from '../../components/Text';
import Router from 'next/router';

const { Header, Content } = Layout;

const UsersContainer = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState('');

  const [form] = Form.useForm();

  const getUsers = () => {
    const params = {};
    params.per_page = 12;
    apiClient('get', 'users', false, params)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const handleDelete = (id) => {
    setUsers(users.filter((i) => i.id !== id));
    message.success('User berhasil di hapus... :-)');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder="Cari..."
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          handleClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          isClass="search"
          text="Cari"
        />
        <Button
          handleClick={() => handleReset(clearFilters)}
          isClass="search"
          text="Reset"
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#72a065' : '#9da2a6' }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(
          () =>
            searchInput && searchInput.current && searchInput.current.select()
        );
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const data = [];
  users.map((user, index) => {
    data.push({
      key: `key-${user.id}`,
      index,
      id: user.id,
      no: index + 1,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
    });
    return user;
  });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = <Input />;
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
                message: `${title} harus di isi!`,
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
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      email: '',
      first_name: '',
      last_name: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newUsers = [...users];
      const index = newUsers.findIndex((item) => key === item.id);

      if (index > -1) {
        newUsers.splice(index, 1, { ...newUsers[index], ...row });
        setUsers(newUsers);
        setEditingKey('');
        message.success('Perubahan data berhasil di simpan... :-)')
      } else {
        newUsers.push(row);
        setUsers(newUsers);
        setEditingKey('');
      }
    } catch (errInfo) {
      message.error(`${errInfo} :-(`)
    }
  };

  const columns = [
    {
      title: 'No.', dataIndex: 'no', align: 'center', width: 70,
    },
    {
      title: 'Photo',
      dataIndex: 'avatar',
      with: '70px !important',
      render: (avatar) => (
        <Avatar size="large" src={avatar} />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      sorter: (a, b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps('email'),
      editable: true,
    },
    {
      title: 'Nama Depan',
      dataIndex: 'first_name',
      align: 'center',
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      ...getColumnSearchProps('first_name'),
      editable: true,
    },
    {
      title: 'Nama Belakang',
      dataIndex: 'last_name',
      align: 'center',
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
      ...getColumnSearchProps('last_name'),
      editable: true,
    },
    {
      title: 'Actions',
      dataIndex: '',
      align: 'center',
      render: (_, row) => {
        const editable = isEditing(row);
        return editable
          ? (
            <>
              <Link
                role="presentation"
                onClick={() => save(row.id)}
                style={{
                  marginRight: 8,
                }}
              >
                Simpan
              </Link>
              <span className="padding-side-2">|</span>
              <span>
                <Popconfirm
                  title="Yakin akan membatalkan?"
                  onConfirm={cancel}
                  okText="Ya"
                  cancelText="Tidak"
                >
                  <Link>Batal</Link>
                </Popconfirm>
              </span>
            </>
          ) : (
            <>
              <Popconfirm
                title="Anda yakin akan menghapus user ini?"
                onConfirm={() => handleDelete(row.id)}
                okText="Ya"
                cancelText="Tidak"
              >
                <Tooltip placement="bottom" title="Hapus" className="pointer text-red">
                  <DeleteOutlined />
                </Tooltip>
              </Popconfirm>
              <span className="padding-side-2">|</span>
              <span disabled={editingKey !== ''} onClick={() => edit(row)}>
                <Tooltip placement="bottom" title="Ubah" className="pointer text-blue">
                  <EditOutlined />
                </Tooltip>
              </span>
            </>
          )
      }
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <Row style={{ marginTop: '1%' }}>
          <Col span={12}><Title level={3}>CrudNextJs</Title></Col>
          <Col span={12}>
            <Title level={5} onClick={() => Router.push('/')} className="text-right pointer">
              <LogoutOutlined className="text-black padding-side-2" />
              Logout
            </Title>
          </Col>
        </Row>
      </Header>
      <Content style={{ marginTop: 90, padding: '0 20px' }}>
        <Form form={form} component={false}>
          <Table
            columns={mergedColumns}
            dataSource={data}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
          />
        </Form>
      </Content>
    </Layout>
  );
};
export default UsersContainer;
