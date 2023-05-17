import React from "react";
import {Divider, Select, Typography} from "antd";

const { Option } = Select;

const { Title } = Typography;
const Categories = () => {
    return (
         <div>
            <Title level={4}>Category page</Title>
            <Divider />
            <div style={{ display: "flex", flexDirection: "row" }}>

            <div style={{  flex: 1, padding: "10px" }}>
            </div>

            <div style={{  flex: 1, padding: "10px" }}>
            </div>
            </div>
         </div>
    )
}

export default Categories;