import { useState } from 'react'
import Task from "./components/Task.jsx"
import { Button, Flex ,Space,Col, Row} from 'antd';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Row>
        <Col span={24} > 
          <h1 className='centered-title'>Task Manager</h1>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Space>
          <Button type="primary">Primary Button 2</Button>
          <Button type="primary">Primary Button 2</Button>
        </Space>
        </Col>
      </Row>
    </div>
  )
}

export default App
