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

const MobileBillForm = ({ userDetail }) => {
  const [loginUser, setLoginUser] = useState(null);

  const [formData, setFormData] = useState({
    salesmanId: loginUser?.data?._id,
    location: "",
    billDate: "",
    paymentMode: "cash",
    billType: "credit",
    shop: "",
  });

  console.log(userDetail);

  useEffect(() => {
    const data = localStorage.getItem("userData");

    if (data) {
      try {
        const user = JSON.parse(data);
        setLoginUser(user);

        // update formData with salesmanId
        setFormData((prev) => ({
          ...prev,
          salesmanId: user?._id || user?.data?._id, // depending on your API shape
          salesmanName: user?.username || user?.data?.username,
        }));
      } catch (err) {
        console.error("Failed to parse userData:", err);
      }
    }
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    console.log("Raw userData from storage:", data); // 🔍 check here

    if (data) {
      try {
        const user = JSON.parse(data);
        console.log("Parsed user:", user);
        setLoginUser(user);
      } catch (err) {
        console.error("Failed to parse userData:", err);
      }
    }
  }, []);

  const [products, setProducts] = useState([
    {
      itemName: "",
      unit: "",
      qty: "",
      freeQty: "",
      rate: "",
      schemePercent: "",
      schemeAmount: "",
      cdPercent: "",
      cdAmount: "",
      totalGstAmount: "",
    },
  ]);

  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [shops, setShops] = useState([]);
  const [activeProductIndex, setActiveProductIndex] = useState(null);

  // fetch invoices
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

  // handle bill form change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // handle product field change

  // const handleProductChange = (index, field, value) => {
  //   setProducts((prev) =>
  //     prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
  //   );
  // };
  const handleProductChange = (index, field, value) => {
    setProducts((prev) =>
      prev.map((p, i) => {
        if (i === index) {
          let updated = { ...p, [field]: value };

          // Ensure numeric values
          const qty = Number(updated.qty) || 0;
          const free = Number(updated.Free) || 0;
          const maxAvailable = Number(updated.availableQty) || 0;

          // If either quantity or Free changes, adjust max
          if (field === "qty" || field === "Free") {
            if (qty + free > maxAvailable) {
              if (field === "qty") {
                updated.qty = maxAvailable - free;
              } else {
                updated.Free = maxAvailable - qty;
              }
              alert(
                `Total of Quantity + Free cannot exceed available quantity (${maxAvailable})`
              );
            }
          }

          return updated;
        }
        return p;
      })
    );
  };

  // when product is selected from modal
  // const getSelectedProductData = (val) => {
  //   console.log(val);

  //   setProducts((prev) =>
  //     prev.map((p, i) =>
  //       i === activeProductIndex
  //         ? {
  //             ...p,
  //             itemName: val.productName,
  //             unit: val.primaryUnit,
  //             primaryUnit: val.primaryUnit, // ✅ add this
  //             secondaryUnit: val.secondaryUnit, // ✅ add this
  //             rate: val.salesRate,
  //             availableQty: val.availableQty,
  //           }
  //         : p
  //     )
  //   );
  //   setShowModel(false); // close modal automatically
  // };

  const getSelectedProductData = (val) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === activeProductIndex
          ? {
              ...p,
              itemName: val.productName,
              unit: val.primaryUnit,
              primaryUnit: val.primaryUnit,
              secondaryUnit: val.secondaryUnit,
              rate: val.salesRate,
              availableQty: val.availableQty, // important!
            }
          : p
      )
    );
    setShowModel(false);
  };

  // add new blank product row
  const addNewProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        itemName: "",
        unit: "",
        qty: "",
        freeQty: "",
        rate: "",
        schemePercent: "",
        schemeAmount: "",
        cdPercent: "",
        cdAmount: "",
        totalGstAmount: "",
      },
    ]);
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Bill Submitted:", {
      billDetails: formData,
      products: products,
    });

    const res = await axios.post("/addsalesmanproductdata/additem", {
      formData,
      products,
    });

    console.log(res);
  };

  // fetch shops by location
  const handlefetchShop = async (location) => {
    try {
      const res = await axios.get("/fetchshopname", {
        params: { location },
      });
      setShops(res?.data);
    } catch (err) {
      console.error("Error fetching shop:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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

              {/* <div className="flex flex-col gap-2">
                <Label>Unit</Label>
                <Input type="text" value={product.unit} readOnly />
              </div> */}

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
                    <SelectItem value={`${product?.primaryUnit}`}>
                      {product?.primaryUnit}
                    </SelectItem>
                    <SelectItem value={`${product?.secondaryUnit}`}>
                      {product?.secondaryUnit}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={product.qty}
                  min={0}
                  max={product.availableQty - (product.Free || 0)}
                  onChange={(e) =>
                    handleProductChange(index, "qty", e.target.value)
                  }
                />
                <small className="text-gray-500">
                  Available: {product.availableQty - (product.Free || 0)}
                </small>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Free</Label>
                <Input
                  type="number"
                  value={product.Free}
                  min={0}
                  max={product.availableQty - (product.qty || 0)}
                  onChange={(e) =>
                    handleProductChange(index, "Free", e.target.value)
                  }
                />
                <small className="text-gray-500">
                  Max Free: {product.availableQty - (product.qty || 0)}
                </small>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Basic</Label>
                <Input
                  type="text"
                  value={product.basic}
                  onChange={(e) =>
                    handleProductChange(index, "basic", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Rate</Label>
                <Input
                  type="number"
                  value={product.rate}
                  onChange={(e) =>
                    handleProductChange(index, "rate", e.target.value)
                  }
                />
              </div>

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

              <div className="flex flex-col gap-2">
                <Label>SchAmt</Label>
                <Input
                  type="number"
                  value={product.schAmt}
                  onChange={(e) =>
                    handleProductChange(index, "scAamt", e.target.value)
                  }
                />
              </div>

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

              <div className="flex flex-col gap-2">
                <Label>CDAmt</Label>
                <Input
                  type="number"
                  value={product.cdAmt}
                  onChange={(e) =>
                    handleProductChange(index, "cdAmt", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Total</Label>
                <Input
                  type="number"
                  value={product.total}
                  onChange={(e) =>
                    handleProductChange(index, "total", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>GST</Label>
                <Input
                  type="number"
                  value={product.gst}
                  onChange={(e) =>
                    handleProductChange(index, "gst", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={product.amount}
                  onChange={(e) =>
                    handleProductChange(index, "amount", e.target.value)
                  }
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

        <Button type="submit" className="w-full">
          Submit Bill
        </Button>
      </form>

      {showModel && (
        <ItemNameModel
          getSelectedProductData={getSelectedProductData}
          setShowModel={setShowModel}
        />
      )}
    </>
  );
};

export default MobileBillForm;
