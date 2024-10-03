import { useEffect, useState,useContext,useRef } from 'react'
import { Button, Flex ,Space,Col, Row,Table,Typography, Layout,Input,Popconfirm,InputNumber
  ,Form,Dropdown,Menu, Select,Switch } from 'antd';

import './App.css'
import axios from 'axios';
const { Text, Link } = Typography;
const { Header, Footer, Content } = Layout;

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
  const inputNode =
    inputType === 'status' ? (
      <Select>
        <Option value="Pending">Pending</Option>
        <Option value="In progress">In progress</Option>
        <Option value="Completed">Completed</Option>
      </Select>
    ) : (
      <Input />
    );
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

function App() {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState([])
  const [count, setCount] = useState(1);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;

  const [addingKey, setAddingKey] = useState('');
  const isAdding = (record) => record === addingKey;
  
  const edit = (record) => {
    form.setFieldsValue({
      title: '',
      description: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const handleAdd = () => {
    const now = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' });
    const newData = {
      key: count,
      id: count,
      created_at: now,
      updated_at: now,
    };
    form.setFieldsValue({
      title: '',
      description: '',
    });
    setTasks([...tasks, newData]);
    setAddingKey(count);
    setCount(count + 1);
    console.log(count)
  };

  const saveAdding = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...tasks];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setTasks(newData);
        const taskToAdd = {
          title: row.title,
          description: row.description,
          status: row.status,
        };
        const response = await axios.post(`http://127.0.0.1:8000/tasks/`, taskToAdd);
        item.updated_at = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })
        item.created_at = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })
        console.log(response)
        setAddingKey('');
      } 

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const cancelEdite = () => {
    setEditingKey('');
  };

  const cancelAdding = (key) => {
    setAddingKey('');
    const newData = tasks.filter((item) => item.key !== key);
    setTasks(newData);
    setCount(count - 1);
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...tasks];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const taskToUpdate = {
          title: row.title,
          description: row.description,
          status: row.status,
          
        };
        const response = await axios.put(`http://127.0.0.1:8000/tasks/${item.id}`, taskToUpdate);
        console.log(response.data)
        item.updated_at = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })
        
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setTasks(newData);
        setEditingKey('');
      } 

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleChange = (value) => {
    form.setFieldsValue({
      status: value,
    });
    console.log('Selected value:', value);
  };

  const handleDelete = async (key) => {
    try {
      const taskToDelete = tasks.find((item) => item.key === key);
      
      if (!taskToDelete) {
        console.error('Task not found');
        return;
      }
  
      const response = await axios.delete(`http://127.0.0.1:8000/tasks/${taskToDelete.id}`);
      console.log(response);
  
      const newData = tasks.filter((item) => item.key !== key);
      setTasks(newData);
      setCount(count - 1);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const status = [
    {
      value: 'Pending',
      label: 'Pending',
    },
    {
      value: 'In progress',
      label: 'In progress',
    },
    {
      value: 'Completed',
      label: 'Completed',
    },
  ];

  const columns = [
    {
      title: 'id',
      dataIndex: 'key',
      key: 'key',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
      editable: true,
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description',
      editable: true,
    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'Pending',
          value: 'Pending',
        },
        {
          text: 'In progress',
          value: 'In progress',
        },
        {
          text: 'Completed',
          value: 'Completed',
        },
      ],
      editable: true,
      onFilter: (value, record) => {
        const editable = isEditing(record);
        const adding = isAdding(record.key);
        return editable || adding ? true : record.status.startsWith(value);
      },
      filterSearch: true,
      width: '20%',
      render: (text, record) => {
        const editable = isEditing(record);
        const adding = isAdding(record.key);
        return editable ? (
          (<Select style={{
            width: '100%',
          }} defaultValue={e} onChange={handleChange} options={status} />)
        ) : adding ? (
          (<Select style={{
            width: '100%',
          }}  defaultValue={e} onChange={handleChange} options={status} />)
        ) : (
          <span>
          <Text>
            {text}
          </Text>
        </span>
        );
      },
    },
    {
      title: 'created_at',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'updated_at',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        const adding = isAdding(record.key);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancelEdite}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : adding ? (
          <span>
            <Typography.Link
              onClick={() => saveAdding(record.key)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              Add
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={() => cancelAdding(record.key)}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
          <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{
              marginInlineEnd: 8,
            }}
          >Edit
          </Typography.Link>
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record.key)}
            >
            <a style={{ color: 'red' }}>Delete</a>
          </Popconfirm>
        </span>
        );
      },
      
    },
  ]

  const getTasks = () => {
    axios.get('http://127.0.0.1:8000/tasks').then(r => {
      let countTask = 1;
      const taskResponse = r.data.map(t => {
        console.log(t.created_at)
        const task = {
          key: countTask,
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          created_at: new Date(t.created_at + 'Z').toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' }),
          updated_at: new Date(t.updated_at + 'Z').toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' }),
        };
        countTask += 1;
        return task;
      });
      setCount(countTask)
      setTasks(taskResponse)
    })
  }

  useEffect(() => {
    getTasks()
  },[])

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record) || isAdding(record.key),
      }),
    };
  });
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  return (
    <div>
      <Layout>
        <Header style={{
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'

        }}>
          <h1>Task Manager</h1>
        </Header>
        <Content style={{
          backgroundColor: 'white',
          padding: '0 18px',
        }}>
          <Space size={50}>
            <Button size='50' onClick={handleAdd} type="primary">Add</Button>
          </Space>
          <Form form={form} component={false}>
          <Table 
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            style={{
            padding: 24,
            minHeight: 280,
          }} columns={mergedColumns} dataSource={tasks} rowClassName="editable-row" 
            pagination={{
            onChange: cancelEdite,
          }}
          showSorterTooltip={{
            target: 'sorter-icon',
          }}
          onChange={onChange}/>
          </Form>
        </Content>
      </Layout>
    </div>
  )
}

export default App