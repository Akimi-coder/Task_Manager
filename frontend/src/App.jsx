import { useState } from 'react'
import Task from "./components/Task.jsx"
import { Button, Flex ,Space,Col, Row,Table,Typography, Layout } from 'antd';
import './App.css'
const { Text, Link } = Typography;
const { Header, Footer, Content } = Layout;

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      if (text === 'done'){
        return  <Text type="success">{text}</Text>
      }
      if (text === 'reject'){
        return  <Text type="danger">{text}</Text>
      }
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
    render: (_, record) => (
      <Space size="middle">
        <a>Delete</a>
      </Space>
    ),
  },
]

const data = [
  {
    id: '1',
    title: 'Cooking',
    description: 'cook salat',
    status: 'done',
    created_at: '1',
    updated_at: 'New York No. 1 Lake Park',
    
  },
];

function App() {
  const [count, setCount] = useState(0)

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
            <Button size='50' type="primary">Add</Button>
            <Button type="primary">Edit</Button>
          </Space>
          <Table style={{
            padding: 24,
            minHeight: 280,
          }} columns={columns} dataSource={data} />
        </Content>
      </Layout>
    </div>
  )
}

export default App
