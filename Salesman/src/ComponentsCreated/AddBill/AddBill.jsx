import React, { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import axios from "../../Config/axios";
import ItemNameModel from "../itemNameModel/ItemNameModek";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
// import { toast } from "react-toastify";
import { toast, ToastContainer } from "react-toastify";

const MobileBillForm = ({ userDetail }) => {
  const initialFormData = {
    salesmanId: "",
    salesmanName: "",
    location: "",
    billDate: "",
    paymentMode: "cash",
    billType: "credit",
    shop: "",
  };

  const initialProduct = {
    productId:"",
    itemName: "",
    unit: "",
    primaryUnit: "",
    secondaryUnit: "",
    qty: 0,
    freeQty: 0,
    rate: 0,
    sch: 0,
    schAmt: 0,
    cd: 0,
    cdAmt: 0,
    total: 0,
    GST: 0,
    totalGstAmount: 0,
    amount: 0,
    finalAmount: 0,
    pendingAmount: 0,
    availableQty: 0,
  };

  const [loginUser, setLoginUser] = useState([initialProduct]);
  const [formData, setFormData] = useState(initialFormData);

  const [products, setProducts] = useState([
    {
      productId:"",
      itemName: "",
      unit: "",
      primaryUnit: "",
      secondaryUnit: "",
      qty: 0,
      freeQty: 0,
      rate: 0,
      sch: 0,
      schAmt: 0,
      cd: 0,
      cdAmt: 0,
      total: 0,
      GST: 0,
      totalGstAmount: 0,
      amount: 0,
      finalAmount: 0,
      pendingAmount: 0,
      availableQty: 0,
    },
  ]);

  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [shops, setShops] = useState([]);
  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const [disable, setDisable] = useState(false);

  // Load user once
  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      try {
        const user = JSON.parse(data);
        setLoginUser(user);

        const id = user?._id || user?.data?._id;
        const username = user?.username || user?.data?.username;

        setFormData((prev) => ({
          ...prev,
          salesmanId: id,
          salesmanName: username,
        }));
      } catch (err) {
        console.error("Failed to parse userData:", err);
      }
    }
  }, []);

  // Fetch invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/pro-billing/salesman");
      setInvoices(response.data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Generic form field change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Product field change + calculation
  const handleProductChange = (index, field, value) => {
    setProducts((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;

        const updated = { ...p };

        if (
          [
            "qty",
            "freeQty",
            "rate",
            "sch",
            "cd",
            "GST",
            "availableQty",
          ].includes(field)
        ) {
          updated[field] = value === "" ? 0 : Number(value);
        } else {
          updated[field] = value;
        }

        // Validation qty + freeQty <= availableQty
        const qty = Number(updated.qty) || 0;
        const free = Number(updated.freeQty) || 0;
        const maxAvailable = Number(updated.availableQty) || 0;

        if (qty + free > maxAvailable) {
          if (field === "qty") {
            updated.qty = Math.max(0, maxAvailable - free);
          } else if (field === "freeQty") {
            updated.freeQty = Math.max(0, maxAvailable - qty);
          }
          alert(
            `Total of Quantity + Free cannot exceed available quantity (${maxAvailable})`
          );
        }

        // Recalculate derived fields
        const rate = Number(updated.rate) || 0;
        const gst = Number(updated.GST) || 0;
        const qtyNum = Number(updated.qty) || 0;

        const basic = ((100 - gst) * rate) / 100;

        const schAmt = basic * qtyNum * ((Number(updated.sch) || 0) / 100);
        const cdAmt = basic * qtyNum * ((Number(updated.cd) || 0) / 100);

        const totalBeforeGst = basic * qtyNum - schAmt - cdAmt;
        const totalGstAmount = totalBeforeGst * (gst / 100);
        const total = totalBeforeGst;
        const amount = total + totalGstAmount;

        updated.schAmt = schAmt;
        updated.cdAmt = cdAmt;
        updated.total = total;
        updated.totalGstAmount = totalGstAmount;
        updated.amount = amount;
        updated.finalAmount = amount;
        updated.pendingAmount = amount;

        return updated;
      })
    );
  };

  // When product is selected from modal
  const getSelectedProductData = (val) => {
    console.log(val);
    
    if (activeProductIndex === null) {
      setShowModel(false);
      return;
    }

    setProducts((prev) =>
      prev.map((p, i) =>
        i === activeProductIndex
          ? {
              ...p,
              productId:val?._id,
              itemName: val.productName ?? p.itemName,
              unit: val.primaryUnit ?? p.unit,
              primaryUnit: val.primaryUnit ?? p.primaryUnit,
              secondaryUnit: val.secondaryUnit ?? p.secondaryUnit,
              rate: Number(val.salesRate) || p.rate,
              availableQty: Number(val.availableQty) || p.availableQty,
              GST: Number(val.gstPercent) || p.GST,
            }
          : p
      )
    );
    setShowModel(false);
  };

  // Add new blank product row
  const addNewProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        productId:"",
        itemName: "",
        unit: "",
        primaryUnit: "",
        secondaryUnit: "",
        qty: 0,
        freeQty: 0,
        rate: 0,
        sch: 0,
        schAmt: 0,
        cd: 0,
        cdAmt: 0,
        total: 0,
        GST: 0,
        totalGstAmount: 0,
        amount: 0,
        finalAmount: 0,
        pendingAmount: 0,
        availableQty: 0,
      },
    ]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    console.log("Bill Submitted:", { billDetails: formData, products });

    try {
      const res = await axios.post("/addsalesmanproductdata/additem", {
        formData,
        products,
      });

      console.log(res);

      if (res?.data?.status) {
        // toast.success("Item added successfully");
        toast.success("Bill created successfully");

        const data = localStorage.getItem("userData");
        let salesmanId = "";
        let salesmanName = "";
        if (data) {
          const user = JSON.parse(data);
          salesmanId = user?._id || user?.data?._id || "";
          salesmanName = user?.username || user?.data?.username || "";
        }

        setFormData({
          ...initialFormData,
          salesmanId,
          salesmanName,
        });

        setProducts([initialProduct]);
        setDisable(false);
      }

      console.log("Server response:", res);
    } catch (err) {
      setDisable(false);
      console.error("Submit failed:", err);
    } finally {
      setDisable(false);
    }
  };

  // Fetch shops by location
  const handlefetchShop = async (location) => {
    try {
      const res = await axios.get("/fetchshopname", { params: { location } });
      setShops(res?.data ?? []);
    } catch (err) {
      console.error("Error fetching shop:", err);
    }
  };

  // Calculate grand total
  const grandTotal = products.reduce((sum, p) => sum + (p.amount || 0), 0);

  console.log(grandTotal);

  if (loading) return <div>Loading...</div>;

  return (
    <>
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
                  handleChange("location", val);
                  handlefetchShop(val);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Enter location" />
                </SelectTrigger>

                <SelectContent>
                  {invoices?.[0]?.salesmanId?.beat
                    ?.filter(
                      (beatItem) =>
                        beatItem?.area && beatItem.area.trim() !== ""
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
                onValueChange={(val) => handleChange("shop", val)}
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

          {products.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border-b pb-4 mb-4"
            >
              {/* Item Name */}
              <div className="flex flex-col gap-2">
                <Label>Item Name</Label>
                <Input
                  type="text"
                  value={product.itemName}
                  readOnly
                  onClick={() => {
                    setActiveProductIndex(index);
                    setShowModel(true);
                  }}
                  placeholder="Click to select item"
                />
              </div>

              {/* Unit */}
              <div className="flex flex-col gap-2">
                <Label>Unit</Label>
                <Select
                  value={product.unit}
                  onValueChange={(val) =>
                    handleProductChange(index, "unit", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {product?.primaryUnit ? (
                      <SelectItem value={product.primaryUnit}>
                        {product.primaryUnit}
                      </SelectItem>
                    ) : null}
                    {product?.secondaryUnit ? (
                      <SelectItem value={product.secondaryUnit}>
                        {product.secondaryUnit}
                      </SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={product.qty}
                  min={0}
                  max={Math.max(
                    0,
                    (product.availableQty || 0) - (product.freeQty || 0)
                  )}
                  onChange={(e) =>
                    handleProductChange(index, "qty", e.target.value)
                  }
                />
                <small className="text-gray-500">
                  Available:{" "}
                  {Math.max(
                    0,
                    (product.availableQty || 0) - (product.freeQty || 0)
                  )}
                </small>
              </div>

              {/* Free */}
              <div className="flex flex-col gap-2">
                <Label>Free</Label>
                <Input
                  type="number"
                  value={product.freeQty}
                  min={0}
                  max={Math.max(
                    0,
                    (product.availableQty || 0) - (product.qty || 0)
                  )}
                  onChange={(e) =>
                    handleProductChange(index, "freeQty", e.target.value)
                  }
                />
                <small className="text-gray-500">
                  Max Free:{" "}
                  {Math.max(
                    0,
                    (product.availableQty || 0) - (product.qty || 0)
                  )}
                </small>
              </div>

              {/* Basic */}
              <div className="flex flex-col gap-2">
                <Label>Basic</Label>
                <Input
                  type="text"
                  value={(() => {
                    const rate = Number(product?.rate) || 0;
                    const gst = Number(product?.GST) || 0;
                    const basic = ((100 - gst) * rate) / 100;
                    return (Number.isFinite(basic) ? basic : 0).toFixed(2);
                  })()}
                  readOnly
                />
              </div>

              {/* Rate (read-only, from backend) */}
              <div className="flex flex-col gap-2">
                <Label>Rate</Label>
                <Input type="number" value={product.rate} readOnly />
              </div>

              {/* SCH% */}
              <div className="flex flex-col gap-2">
                <Label>SCH%</Label>
                <Input
                  type="number"
                  value={product.sch}
                  onChange={(e) =>
                    handleProductChange(index, "sch", e.target.value)
                  }
                />
              </div>

              {/* SchAmt (calculated) */}
              <div className="flex flex-col gap-2">
                <Label>SchAmt</Label>
                <Input
                  type="number"
                  value={(() => {
                    const rate = Number(product?.rate) || 0;
                    const gst = Number(product?.GST) || 0;
                    const basic = ((100 - gst) * rate) / 100;
                    const qty = Number(product?.qty) || 0;
                    const schPercent = Number(product?.sch) || 0;
                    const schAmt = basic * qty * (schPercent / 100);
                    return (Number.isFinite(schAmt) ? schAmt : 0).toFixed(2);
                  })()}
                  readOnly
                />
              </div>

              {/* CD% */}
              <div className="flex flex-col gap-2">
                <Label>CD%</Label>
                <Input
                  type="number"
                  value={product.cd}
                  onChange={(e) =>
                    handleProductChange(index, "cd", e.target.value)
                  }
                />
              </div>

              {/* CDAmt (calculated) */}
              <div className="flex flex-col gap-2">
                <Label>CDAmt</Label>
                <Input
                  type="number"
                  value={(() => {
                    const rate = Number(product?.rate) || 0;
                    const gst = Number(product?.GST) || 0;
                    const basic = ((100 - gst) * rate) / 100;
                    const qty = Number(product?.qty) || 0;
                    const cdPercent = Number(product?.cd) || 0;
                    const cdAmt = basic * qty * (cdPercent / 100);
                    return (Number.isFinite(cdAmt) ? cdAmt : 0).toFixed(2);
                  })()}
                  readOnly
                />
              </div>

              {/* Total (calculated) */}
              {/* <div className="flex flex-col gap-2">
                <Label>Total</Label>
                <Input
                  type="number"
                  value={(() => {
                    const rate = Number(product?.rate) || 0;
                    const gst = Number(product?.GST) || 0;
                    const basic = ((100 - gst) * rate) / 100;
                    const qty = Number(product?.qty) || 0;
                    const schAmt =
                      basic * qty * (Number(product?.sch) / 100 || 0);
                    const cdAmt =
                      basic * qty * (Number(product?.cd) / 100 || 0);
                    const total = basic * qty - schAmt - cdAmt;
                    // setProducts((prev) => [...prev, total]);

                    return (Number.isFinite(total) ? total : 0).toFixed(2);
                  })()}
                  readOnly
                />
              </div> */}

              <div className="flex flex-col gap-2">
                <Label>Total</Label>
                <Input
                  type="number"
                  value={product.total.toFixed(2)}
                  readOnly
                />
              </div>

              {/* GST */}
              <div className="flex flex-col gap-2">
                <Label>GST</Label>
                <Input type="number" value={product.GST} readOnly />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={product.amount.toFixed(2)}
                  readOnly
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addNewProduct}
            className="mt-2"
          >
            + Add Product
          </Button>
        </div>

        <Button disabled={disable} type="submit" className="w-full">
          {disable ? "Submitting..." : "Submit Bill"}
        </Button>
      </form>

      {showModel && (
        <ItemNameModel
          getSelectedProductData={getSelectedProductData}
          setShowModel={setShowModel}
        />
      )}
      {/* <ToastContainer/> */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default MobileBillForm;
