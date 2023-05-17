import React, { useEffect, useState } from "react";
import { Button, DatePicker, Divider, Form, Input, InputNumber, Select, Table, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { SERVER_URL } from "../utils/constants";

const { Option } = Select;

const { Title } = Typography;

const Transactions = () => {
  const [form] = Form.useForm();
  const [transactions, setTransactions] = useState([{
    'transactionDate': new Date('2023-05-17').toString(),
    'description': 'Random',
    'category': '646483bc1525280405ec516c',
    'account': '6464ad48b74fe5e4fa0d6255',
    'amount': 1000
  }]);

  const onFinish = (values) => {
    const newTransaction = {
      key: transactions.length + 1,
      ...values,
    };

    // Add the new transaction to the transactions state
    setTransactions([...transactions, newTransaction]);
    form.resetFields();
  };

  useEffect(() => {
    async function getAllTransactions() {
      // Fetch transactions from the server
      const response = await fetch(`${SERVER_URL}/transaction`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        // setTransactions(data);
        // console.log(data);
      }
    }

    getAllTransactions();
  }, []);

  const columns = [
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      width: "15%",
      // render: (text, record) => <span>{record.transactionDate.format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "25%",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "15%",
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
      width: "15%",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      render: (text, record) => <span>{`$${record.amount.toFixed(2)}`}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "15%",
    },
  ];

  return (
    <div>
      <Title level={4}>Transactions page</Title>
      <Divider />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: 1, padding: "10px" }}>
          <Form form={form} name="transactionForm" onFinish={onFinish} style={{ maxWidth: 400 }}>
            <Form.Item name="transactionDate" label="Transaction Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select placeholder="Select a category" allowClear>
                <Option value="category1">Category 1</Option>
                <Option value="category2">Category 2</Option>
                <Option value="category3">Category 3</Option>
              </Select>
            </Form.Item>
            <Form.Item name="account" label="Account" rules={[{ required: true }]}>
              <Select placeholder="Select an account" allowClear>
                <Option value="account1">Account 1</Option>
                <Option value="account2">Account 2</Option>
                <Option value="account3">Account 3</Option>
              </Select>
            </Form.Item>
            <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select placeholder="Select a type" allowClear>
                <Option value="income">Income</Option>
                <Option value="expenditure">Expenditure</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<CalendarOutlined />} size={30}>
                Add Transaction
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div style={{ flex: 1, padding: "10px" }}>
          <Table dataSource={transactions} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;

