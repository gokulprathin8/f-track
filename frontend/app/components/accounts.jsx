import React from 'react';
import {Button, Form, Input, Select, InputNumber, Table} from 'antd';
import { Typography } from 'antd';
import { Divider } from 'antd';
import {DeleteOutlined, EditOutlined, UserAddOutlined} from "@ant-design/icons";


const { Option } = Select;

const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    balance: 32,
    type: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    balance: 42,
    type: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Account Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Account Type',
    dataIndex: 'type',
    key: 'age',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'address',
  },
    {
        title: "",
        key: "operation-delete",
        width: 100,
        render: () => <DeleteOutlined />
    },
    {
        title: "",
        key: "operation-edit",
        width: 100,
        render: () => <EditOutlined />
    }
];

const Accounts = () => {
    const [form] = Form.useForm();

    function onFinish() {

    }

    return (
        <div>
            <Title level={4}>Accounts page</Title>
            <Divider />
            <div style={{ display: "flex", flexDirection: "row" }}>

            <div style={{  flex: 1, padding: "10px" }}>
                <Form
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                style={{ maxWidth: 300 }}
                >

                    <Form.Item name="Name" label="Account Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="type" label="Account Type" rules={[{ required: true }]}>
                    <Select
                      placeholder="Type"
                      allowClear
                    >
                      <Option value="0">Checking</Option>
                      <Option value="1">Saving</Option>
                      <Option value="2">Credit</Option>
                    </Select>
                  </Form.Item>

                    <Form.Item label="Balance" required={true}>
                        <InputNumber />
                    </Form.Item>

                    <Form.Item>
                       <Button type="primary" icon={<UserAddOutlined />} size={30} style={{ marginLeft: "150px" }}>
                    Add Account
                  </Button>
                    </Form.Item>
                </Form>
            </div>

            <div style={{ flex: 1, padding: "10px" }}>
                <Table dataSource={dataSource} columns={columns} />
            </div>
            </div>
        </div>
    )
}

export default Accounts;