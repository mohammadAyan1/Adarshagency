import React, { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import axios from "../../Config/axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const MobileBillForm = () => {
  const [formData, setFormData] = useState({
    location: "",
    billDate: "",
    paymentMode: "cash",
    billType: "credit",
    itemName: "",
    quantity: "",
    unit: "",
    freeQty: "",
    rate: "",
    schemePercent: "",
    schemeAmount: "",
    cdPercent: "",
    cdAmount: "",
    totalGstAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [shops, setShops] = useState([]); // store filtered shops

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/pro-billing/salesman");
      setInvoices(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  console.log(invoices);

  const handlefetchShop = async (location) => {
    try {
      const res = await axios.get("/fetchshopname", {
        params: { location }, // sends ?location=XYZ
      });

      console.log("Shop fetched:", res.data);

      // save shops into state
      setShops(res?.data);
    } catch (err) {
      console.error("Error fetching shop:", err);
    }
  };

  useEffect(()=>{
    const res = await axios.get()
  },[])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      {/* Bill Form */}
      <div className="space-y-4 border p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-2">Bill Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Location</Label>
            <Select
              value={formData.location}
              onValueChange={(val) => {
                handleChange("location", val), handlefetchShop(val);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Enter location" />
              </SelectTrigger>
              {/* <SelectContent>
                {invoices?.[0]?.salesmanId?.beat?.map((beatItem, idx) => (
                  <SelectItem key={idx} value={beatItem.area}>
                    {beatItem.area}
                  </SelectItem>
                ))}
              </SelectContent> */}

              <SelectContent>
                {invoices?.[0]?.salesmanId?.beat
                  ?.filter(
                    (beatItem) => beatItem?.area && beatItem.area.trim() !== ""
                  )
                  .map((beatItem, idx) => (
                    <SelectItem key={idx} value={beatItem.area}>
                      {beatItem.area}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Shop</Label>

            <Select
              value={formData.shop}
              onValueChange={(val) => handleChange("shop", val)} // val will be shop._id
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shop" />
              </SelectTrigger>
              <SelectContent>
                {shops.map((shop) => (
                  <SelectItem key={shop._id} value={shop._id}>
                    {shop.name || "Unnamed Shop"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Bill Date</Label>
            <Input
              type="date"
              value={formData.billDate}
              onChange={(e) => handleChange("billDate", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Payment Mode</Label>
            <Select
              value={formData.paymentMode}
              onValueChange={(val) => handleChange("paymentMode", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Bill Type</Label>
            <Select
              value={formData.billType}
              onValueChange={(val) => handleChange("billType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Product Form */}
      <div className="space-y-4 border p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-2">Product Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Item Name</Label>
            <Input
              type="text"
              value={formData.itemName}
              onChange={(e) => handleChange("itemName", e.target.value)}
              placeholder="Enter item name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Unit</Label>
            <Select
              value={formData.unit}
              onValueChange={(val) => handleChange("unit", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pcs">PCS</SelectItem>
                <SelectItem value="box">BOX</SelectItem>
                <SelectItem value="kg">KG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Free Quantity</Label>
            <Input
              type="number"
              value={formData.freeQty}
              onChange={(e) => handleChange("freeQty", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Rate</Label>
            <Input
              type="number"
              value={formData.rate}
              onChange={(e) => handleChange("rate", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Scheme %</Label>
            <Input
              type="number"
              value={formData.schemePercent}
              onChange={(e) => handleChange("schemePercent", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Scheme Amount</Label>
            <Input
              type="number"
              value={formData.schemeAmount}
              onChange={(e) => handleChange("schemeAmount", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>CD %</Label>
            <Input
              type="number"
              value={formData.cdPercent}
              onChange={(e) => handleChange("cdPercent", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>CD Amount</Label>
            <Input
              type="number"
              value={formData.cdAmount}
              onChange={(e) => handleChange("cdAmount", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Total GST Amount</Label>
            <Input
              type="number"
              value={formData.totalGstAmount}
              onChange={(e) => handleChange("totalGstAmount", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Submit Bill
      </Button>
    </form>
  );
};

export default MobileBillForm;
