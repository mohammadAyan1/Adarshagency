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
  const [allInvoices, setAllInvoices] = useState([]);
  const [filterGrid, setFilterGrid] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/pro-billing/salesman");
      setAllInvoices(response.data);
      setInvoices(response.data);
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

  // Search filter
  useEffect(() => {
    if (!filterGrid) {
      setInvoices(allInvoices);
      return;
    }
    const lowerSearch = filterGrid.toLowerCase();
    const filtered = allInvoices.filter(
      (item) =>
        item?.customer?.CustomerName?.toLowerCase().includes(lowerSearch) ||
        item?.customerId?.area?.toLowerCase().includes(lowerSearch) ||
        item?.customer?.FirmName?.toLowerCase().includes(lowerSearch)
    );
    setInvoices(filtered);
  }, [filterGrid, allInvoices]);

  const handleShowTodayBill = () => {
    const today = format(new Date(), "dd-MM-yyyy");
    const todayDateFilter = allInvoices?.filter(
      (item) => format(new Date(item.billDate), "dd-MM-yyyy") === today
    );
    setInvoices(todayDateFilter);
  };

  const handleShowLastMonthBill = () => {
    const now = new Date();
    let lastMonth = getMonth(now) - 1;
    let year = getYear(now);
    if (lastMonth < 0) {
      lastMonth = 11;
      year -= 1;
    }
    const lastMonthBills = allInvoices?.filter((item) => {
      const billDate = new Date(item.billDate);
      return getMonth(billDate) === lastMonth && getYear(billDate) === year;
    });
    setInvoices(lastMonthBills);
  };

  const showAllProduct = async () => {
    setLoading(true);
    try {
      const purRes = await axios.get("/product/salesman");
      setProductData(purRes?.data?.data || []);
      setShowSheet(true);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch initial data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both dates!");
      return;
    }
    const filtered = allInvoices.filter((item) => {
      const billDate = new Date(item.billDate);
      return billDate >= new Date(fromDate) && billDate <= new Date(toDate);
    });
    setInvoices(filtered);
  };

  return (
    <div className="w-full p-2 md:p-4">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div
          onClick={handleShowTodayBill}
          className="cursor-pointer bg-blue-700 text-white rounded p-4 flex flex-col justify-center items-center shadow"
        >
          <h1 className="text-lg font-bold">Today</h1>
          <h1 className="text-lg font-bold">Bill</h1>
        </div>
        <div
          onClick={handleShowLastMonthBill}
          className="cursor-pointer bg-gray-700 text-white rounded p-4 flex flex-col justify-center items-center shadow"
        >
          <h1 className="text-lg font-bold">Month</h1>
          <h1 className="text-lg font-bold">Bill</h1>
        </div>
        <div
          onClick={showAllProduct}
          className="cursor-pointer bg-red-700 text-white rounded p-4 flex flex-col justify-center items-center shadow"
        >
          <h1 className="text-lg font-bold">Product</h1>
          <h1 className="text-lg font-bold">Gallery</h1>
        </div>
      </div>

      {/* Search & Date Filter */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded p-2 w-full md:w-1/3"
          onChange={(e) => setFilterGrid(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 items-start md:items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium">From Date</label>
            <input
              type="date"
              className="border rounded p-2"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">To Date</label>
            <input
              type="date"
              className="border rounded p-2"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <Button
            className="bg-blue-700 text-white mt-2 sm:mt-0"
            onClick={handleDateFilter}
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Bill No.</TableHead>
              <TableHead>Customer/Firm</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bill Date</TableHead>
              <TableHead>Bill Time</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">INV00{index + 1}</TableCell>
                <TableCell>{item?.customer?.CustomerName}</TableCell>
                <TableCell>{item?.customerId?.area}</TableCell>
                <TableCell>{item?.finalAmount?.toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(item?.billDate), "dd-MM-yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(item?.billDate), "hh:mm a")}
                </TableCell>
                {/* <TableCell>
                  <select
                    className="border rounded p-1 text-sm"
                    defaultValue="pending"
                  >
                    <option value="pending">Pending</option>
                    <option value="received">Received</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </TableCell> */}
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowModel(!showModel);
                      setPassBillModelData(item);
                    }}
                  >
                    {showModel ? "Hide" : "Show"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      {showModel && (
        <BillModel
          passBillModelData={passBillModelData}
          setShowModel={setShowModel}
        />
      )}
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
