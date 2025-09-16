import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../../components/ui/button";

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className=" rounded text-white  grid grid-cols-2 md:grid-cols-3 font-bold mb-4 p-2 ">
        <div className="w-40 h-40 bg-blue-700 p-2  rounded flex flex-col justify-center items-center">
          <h1>Today</h1>
          <h1>Bill</h1>
        </div>
        <div className="w-40 h-40 bg-gray-700 p-2  rounded flex flex-col justify-center items-center">
          <h1>Month</h1>
          <h1>Bill</h1>
        </div>
        <div className="w-40 h-40 bg-red-700 p-2  rounded flex flex-col justify-center items-center">
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
            <TableHead>Amount</TableHead>
            <TableHead>Bill Date</TableHead>
            {/* <TableHead><Button>Show</Button></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>$250.00</TableCell>
            <TableHead>
              <Button>Show</Button>
            </TableHead>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashboard;
