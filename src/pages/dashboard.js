import React from "react";
import { Column } from "@ant-design/plots";
import { Table } from "antd";
export const Dashboard = () => {
  const data = [
    {
      type: "january",
      sales: 38,
    },
    {
      type: "febuary",
      sales: 52,
    },
    {
      type: "mars",
      sales: 61,
    },
    {
      type: "april",
      sales: 145,
    },
    {
      type: "mai",
      sales: 48,
    },
    {
      type: "juin",
      sales: 38,
    },
    {
      type: "july",
      sales: 38,
    },
    {
      type: "august",
      sales: 38,
    },
  ];
  const config = {
    data,
    xField: "type",
    yField: "sales",
    color: ({ type }) => {
      if (type === "male") {
        return "red";
      }
      return "#FF6600";
    },
    label: {
      // 可手动配置 label 数据标签位置
      position: "middle",
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Month",
      },
      sales: {
        alias: "Income",
      },
    },
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];
  const data2 = [];
  for (let i = 0; i < 46; i++) {
    data2.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }
  return (
    <div>
      <h3 className="mb-4"> Dashboard</h3>
      <div className="d-flex justify-content-between align-items gap-3">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p>Total</p>
            <h4>1000$</h4>
          </div>
          <div className="d-flex flex-column justify-content align-items-end">
            <h6> 32%</h6>
            Compare To april
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p>Total</p>
            <h4>1000$</h4>
          </div>
          <div className="d-flex flex-column justify-content align-items-end">
            <h6> 32%</h6>
            Compare To april
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p>Total</p>
            <h4>1000$</h4>
          </div>
          <div className="d-flex flex-column justify-content align-items-end">
            <h6 className="green"> 32%</h6>
            Compare To april
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-4"> Income static</h3>
        <div>
          <Column {...config} />
        </div>
      </div>
    </div>
  );
};
