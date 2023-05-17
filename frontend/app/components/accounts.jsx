import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Select, InputNumber, Table, Popconfirm} from 'antd';
// eslint-disable-next-line no-duplicate-imports
import { Typography } from 'antd';
// eslint-disable-next-line no-duplicate-imports
import { Divider } from 'antd';
import {DeleteOutlined, UserAddOutlined} from "@ant-design/icons";
import {SERVER_URL} from "../utils/constants";
import {createAccount, editAccount, getAllAccounts} from "../utils/account";


const { Option } = Select;

const { Title } = Typography;


const Accounts = () => {
    const [form] = Form.useForm();
    const [tableForm] = Form.useForm();

    const [accounts, setAccounts] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [editValue, setEditValue] = useState([]);

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
    tableForm.setFieldsValue({
      name: '',
      balance: '',
      acc_type: '',
      ...record,
    });
    setEditingKey(record.key);
    setEditValue(record);
  };

    const cancel = () => {
        setEditingKey('');
    };
    const save = async (d) => {
        const row = await tableForm.validateFields();
        row['_id'] = editValue['_id'];
        row['acc_type'] = Number(editValue['acc_type']);
        await editAccount(row);
        console.log(row, editValue)
        setEditingKey('');
        setAccounts(await getAllAccounts());
    }

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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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


    async function deleteAccount(data) {
        await fetch(`${SERVER_URL}/delete_account/${data['_id']}`, {
            method: "DELETE"
        });
        setAccounts(await getAllAccounts());
    }

    const columns = [
      {
        title: 'Account Name',
        dataIndex: 'name',
        key: 'name',
        editable: true,
        width: '40%',
      },
      {
        title: 'Account Type',
        dataIndex: 'acc_type',
        key: 'acc_type',
          editable: true,
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
          editable: true,
      },
        {
            title: "",
            key: "operation-delete",
            width: 100,
            render: (d) => <DeleteOutlined
                onClick={() => deleteAccount(d)}
            />
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <Typography.Link
                onClick={() => save(record.key)}
                style={{
                    marginRight: 8,
                }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            }
        }
    ];

    const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'balance' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

    async function onFinish(data) {
        data['acc_type'] = Number(data['acc_type']);
        data['balance'] = Number(data['balance']);
        await createAccount(data);
        setAccounts(await getAllAccounts());
    }

    useEffect(() => {
        async function getAllAccounts() {
            const account = await fetch(`${SERVER_URL}/accounts`, {
                method: "GET"
            });
            setAccounts(await account.json());
        }

        getAllAccounts();
    }, [])

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

                    <Form.Item name="name" label="Account Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="acc_type" label="Account Type" rules={[{ required: true }]}>
                    <Select
                      placeholder="Type"
                      allowClear
                    >
                      <Option value="0">Checking</Option>
                      <Option value="1">Saving</Option>
                      <Option value="2">Credit</Option>
                    </Select>
                  </Form.Item>

                    <Form.Item label="balance" name="balance" required={true}>
                        <InputNumber />
                    </Form.Item>

                    <Form.Item>
                       <Button type="primary" htmlType="submit"
                               icon={<UserAddOutlined />}
                               size={30}
                               style={{ marginLeft: "150px" }}
                       >
                    Add Account
                  </Button>
                    </Form.Item>
                </Form>
            </div>

            <div style={{ flex: 1, padding: "10px" }}>
            <Form form={tableForm} component={false}>
                <Table dataSource={accounts} columns={mergedColumns} components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                rowClassName="editable-row"
            />
            </Form>
            </div>
            </div>
        </div>
    )
}

export default Accounts;