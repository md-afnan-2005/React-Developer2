import React, { Component } from 'react'
import {
  Row,
  Col,
  Card,
  Input,
  Modal,
  Form,
  Button,
  Spin,
  Typography,
} from 'antd'
import { EditOutlined } from '@ant-design/icons'
import axios from 'axios'
import './App.css'

const { Search } = Input

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      loading: true,
      q: '',
      open: false,
      selected: null,
      likedUsers: [], // track liked users
    }
    this.formRef = React.createRef()
  }

  componentDidMount() {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then(r => this.setState({ users: r.data, loading: false }))
      .catch(() => this.setState({ loading: false }))
  }

  // 🔹 Toggle Like
  toggleLike = id => {
    this.setState(prev => ({
      likedUsers: prev.likedUsers.includes(id)
        ? prev.likedUsers.filter(x => x !== id)
        : [...prev.likedUsers, id],
    }))
  }

  // 🔹 Delete User
  handleDelete = id => {
    this.setState(prev => ({
      users: prev.users.filter(u => u.id !== id),
      likedUsers: prev.likedUsers.filter(x => x !== id),
    }))
  }

  // 🔹 Edit Modal
  openEdit = u => {
    this.setState({ selected: u, open: true }, () => {
      this.formRef.current.setFieldsValue({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        website: u.website,
        street: u.address.street,
        city: u.address.city,
        company: u.company.name,
      })
    })
  }

  onFinish = vals => {
    this.setState(prev => ({
      users: prev.users.map(u =>
        u.id === vals.id
          ? {
            ...u,
            name: vals.name,
            email: vals.email,
            phone: vals.phone,
            website: vals.website,
            address: { ...u.address, street: vals.street, city: vals.city },
            company: { ...u.company, name: vals.company },
          }
          : u
      ),
      open: false,
    }))
  }

  render() {
    const { users, loading, q, open, likedUsers } = this.state
    const filtered = users.filter(
      u =>
        u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase())
    )

    return (
      <div style={{ padding: 20 }}>
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          Users (Advanced)
        </Typography.Title>

        <div style={{ maxWidth: 800, margin: '0 auto 24px' }}>
          <Search
            placeholder="Search by name or email"
            enterButton
            onChange={e => this.setState({ q: e.target.value })}
            value={q}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {filtered.map(u => (
              <Col key={u.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  actions={[
                    <Button type="link" onClick={() => this.toggleLike(u.id)}>
                      {likedUsers.includes(u.id) ? 'Unlike ❤️' : 'Like 🤍'}
                    </Button>,
                    <Button danger type="link" onClick={() => this.handleDelete(u.id)}>
                      Delete 🗑️
                    </Button>,
                    <Button type="link" onClick={() => this.openEdit(u)} icon={<EditOutlined />}>
                      Edit
                    </Button>,
                  ]}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                      minHeight: 150,
                    }}
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${encodeURIComponent(
                        u.username
                      )}`}
                      alt={u.name}
                      width="80"
                      height="80"
                      style={{ borderRadius: '50%' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{u.name}</div>
                      <div style={{ fontSize: 13 }}>{u.email}</div>
                      <div style={{ fontSize: 13 }}>{u.company.name}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* 🔹 Edit Modal */}
        <Modal
          open={open}
          onCancel={() => this.setState({ open: false })}
          footer={null}
          title="Edit User"
        >
          <Form ref={this.formRef} layout="vertical" onFinish={this.onFinish}>
            <Form.Item name="id" hidden>
              <input />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
            <Form.Item name="website" label="Website">
              <Input />
            </Form.Item>
            <Form.Item name="street" label="Street">
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>
            <Form.Item name="company" label="Company">
              <Input />
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button onClick={() => this.setState({ open: false })}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
