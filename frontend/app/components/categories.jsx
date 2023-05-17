import React, {useEffect, useState} from "react";
import {Button, Divider, Form, Input, InputNumber, Popconfirm, Select, Table, Typography} from "antd";
import {CalendarOutlined, DeleteOutlined} from "@ant-design/icons";
import {editCategories} from "../utils/category";
import {SERVER_URL} from "../utils/constants";

const { Option } = Select;

const { Title } = Typography;
const Categories = () => {

  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [formData, setFormData] = useState({});

  const isEditing = (record) => record.key === editingKey;

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

  const onFinish = () => {
    // Handle form submission
  };

  const deleteCategories = (data) => {
    // Handle category deletion
  };

  const edit = (record) => {
    // Start editing a category
    tableForm.setFieldsValue({
      name: '',
      cat_type: '',
      ...record,
    });
    setFormData(record);
    setEditingKey(record.key);
  };

  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      row['_id'] = formData['_id'];
      await editCategories(row);
      // Save the edited category
      setEditingKey('');
    } catch (error) {
      console.log('Save Error:', error);
    }
  };

  useEffect(() => {
      async function getAllCategories() {
      const cat = await fetch(`${SERVER_URL}/categories`, {
          method: "GET"
      });
      setAllCategories(await cat.json());
    }

    getAllCategories();
  }, [])

  const cancel = () => {
    setEditingKey('');
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '40%',
    },
    {
      title: 'Category Type',
      dataIndex: 'cat_type',
      key: 'cat_type',
      editable: true,
    },
    {
      title: "",
      key: "operation-delete",
      width: 100,
      render: (record) => (
        <DeleteOutlined onClick={() => deleteCategories(record)} />
      ),
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
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
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
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
    <div>
      <Title level={4}>Category page</Title>
<Divider />
<div style={{ display: "flex", flexDirection: "row" }}>
<div style={{ flex: 1, padding: "10px" }}>
<Form
form={form}
name="control-hooks"
onFinish={onFinish}
style={{ maxWidth: 300 }}
>
<Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
<Input />
</Form.Item>
            <Form.Item name="cat_type" label="Category Type" rules={[{ required: true }]}>
          <Select placeholder="Type" allowClear>
            <Option value="0">Income</Option>
            <Option value="1">Expenditure</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<CalendarOutlined />}
            size={30}
            style={{ marginLeft: "150px" }}
          >
            Add Category
          </Button>
        </Form.Item>
      </Form>
    </div>

    <div style={{ flex: 1, padding: "10px" }}>
      <Form form={tableForm} component={false}>
        <Table
          dataSource={allCategories}
          columns={mergedColumns}
          components={{
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
);
}


export default Categories;