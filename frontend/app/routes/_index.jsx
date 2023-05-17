import React, { useState } from 'react';
import {
MenuFoldOutlined,
MenuUnfoldOutlined,
UploadOutlined,
UserOutlined,
VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import Accounts from "../components/accounts";
import Categories from "../components/categories";
import Transactions from "../components/transactions";

export const meta = () => {
return [{ title: "New Remix App" }];
};

const { Header, Sider, Content } = Layout;

export default function Index() {
const [menuSelected, setMenuSelected] = useState('1');
const [collapsed, setCollapsed] = useState(false);
const {
token: { colorBgContainer },
} = theme.useToken();

const handleMenuClick = (key) => {
setMenuSelected(key);
};

const renderContent = () => {
switch (menuSelected) {
case '1':
return <Accounts />;
case '2':
return <Categories />;
case '3':
return <Transactions />;
default:
return null;
}
};

return (
<Layout>
<Sider trigger={null} collapsible collapsed={collapsed}>
<div className="demo-logo-vertical" />
<Menu
onClick={({ key }) => handleMenuClick(key)}
theme="dark"
mode="inline"
selectedKeys={[menuSelected]}
items={[
{
key: '1',
icon: <UserOutlined />,
label: 'Accounts',
},
{
key: '2',
icon: <VideoCameraOutlined />,
label: 'Categories',
},
{
key: '3',
icon: <UploadOutlined />,
label: 'Transactions',
},
]}
/>
</Sider>
<Layout>
<Header style={{ padding: 0, background: colorBgContainer }}>
<Button
type="text"
icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
onClick={() => setCollapsed(!collapsed)}
style={{
fontSize: '16px',
width: 64,
height: 64,
}}
/>
</Header>
<Content
style={{
margin: '24px 16px',
padding: 24,
height: '88vh',
background: colorBgContainer,
}}
>
{renderContent()}
</Content>
</Layout>
</Layout>
);
}