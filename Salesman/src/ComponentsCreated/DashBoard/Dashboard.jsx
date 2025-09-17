import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "../../Config/axios.js";
import { toast, ToastContainer } from "react-toastify";
import { format, getMonth, getYear } from "date-fns";
import { Button } from "../../components/ui/button";
import BillModel from "../BillModel/BillModel";

import { SheetDemo } from "../SliderSidebar/SliderSideBar.jsx";

const Dashboard = ({ setUserName }) => {
  const [showModel, setShowModel] = useState(false);

  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [passBillModelData, setPassBillModelData] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [productData, setProductData] = useState([]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/pro-billing/salesman");
      setInvoices(response.data);
      console.log(response.data);
      
      // setUserName(response.data)
      setUserName(response.data[0]?.salesmanId);
    } catch (error) {
      toast.error("Failed to fetch invoices");
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  console.log(loading);
  console.log(invoices);

  const handleShowTodayBill = () => {
    const today = format(new Date(), "dd-MM-yyyy");

    const todayDateFilter = invoices?.filter((item) => {
      return format(new Date(item.billDate), "dd-MM-yyyy") === today;
    });

    setInvoices(todayDateFilter);

    console.log(todayDateFilter);
  };

  const handleShowLastMonthBill = () => {
    const now = new Date();
    let lastMonth = getMonth(now) - 1; // previous month (0 = Jan, 11 = Dec)
    let year = getYear(now);

    // if current month is January, then last month is December of previous year
    if (lastMonth < 0) {
      lastMonth = 11;
      year = year - 1;
    }

    const lastMonthBills = invoices?.filter((item) => {
      const billDate = new Date(item.billDate);
      return getMonth(billDate) === lastMonth && getYear(billDate) === year;
    });

    setInvoices(lastMonthBills);
    console.log(lastMonthBills);
  };

  const showAllProduct = async () => {
    setLoading(true);
    try {
      const purRes = await axios.get("/product/salesman");
      console.log(purRes);
      setProductData(purRes?.data?.data || []);

      setShowSheet(true);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch initial data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className=" rounded text-white  grid grid-cols-2 md:grid-cols-3 font-bold mb-4 p-2 ">
        <div
          onClick={handleShowTodayBill}
          className=" cursor-pointer w-40 h-40 bg-blue-700 p-2  rounded flex flex-col justify-center items-center"
        >
          <h1>Today</h1>
          <h1>Bill</h1>
        </div>
        <div
          onClick={handleShowLastMonthBill}
          className="w-40 h-40 bg-gray-700 p-2  rounded flex flex-col justify-center items-center"
        >
          <h1>Month</h1>
          <h1>Bill</h1>
        </div>
        <div
          onClick={showAllProduct}
          className="w-40 h-40 bg-red-700 p-2  rounded flex flex-col justify-center items-center"
        >
          <h1>Product</h1>
          <h1>Gallery</h1>
        </div>
      </div>

      <Table className="w-full max-w-6xl mx-auto">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Bill No.</TableHead>
            <TableHead>Customer/Firm</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Bill Date</TableHead>
            <TableHead>Bill Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">INV00{index + 1}</TableCell>
              <TableCell>{item?.customer?.CustomerName}</TableCell>
              <TableCell>{item?.customerId?.area}</TableCell>
              <TableCell>{item?.finalAmount}</TableCell>
              <TableCell>
                {format(new Date(item?.billDate), "dd-MM-yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(item?.billDate), "hh:mm a")}
              </TableCell>
              <TableCell>
                <select
                  className="border rounded p-1 text-sm"
                  defaultValue="pending"
                  onChange={(e) => console.log("Selected:", e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="delivered">Delivered</option>
                </select>
              </TableCell>
              <TableHead>
                <Button
                  onClick={() => {
                    setShowModel(!showModel);
                    setPassBillModelData(item);
                  }}
                >
                  {showModel ? "Hide" : "Show"}
                </Button>
              </TableHead>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showModel ? (
        <div>
          <BillModel
            passBillModelData={passBillModelData}
            setShowModel={setShowModel}
          />
        </div>
      ) : null}
      <SheetDemo
        isOpen={showSheet}
        setIsOpen={setShowSheet}
        productData={productData}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
