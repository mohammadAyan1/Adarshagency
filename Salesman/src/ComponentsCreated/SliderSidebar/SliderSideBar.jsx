import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

export function SheetDemo({ isOpen, setIsOpen, productData }) {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(productData || []);

  useEffect(() => {
    if (!search) {
      setFilteredData(productData); // show all when empty
    } else {
      const filterData = productData?.filter((item) =>
        item?.productName?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filterData);
    }
  }, [search, productData]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="overflow-y-auto p-2">
        <SheetHeader>
          <SheetTitle>Product Details</SheetTitle>
          <SheetDescription>
            <Input
              placeholder="Search product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SheetDescription>
        </SheetHeader>

        <div>
          {filteredData?.map((item, index) => (
            <div
              key={index}
              className="border rounded p-2 mb-2 flex flex-col gap-4"
            >
              <img
                src={
                  item?.productImg
                    ? `http://localhost:8080/images/${item?.productImg}`
                    : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                }
                alt={item?.productName || "Product"}
                className="w-full h-32 object-cover"
              />
              <div>
                <h1>
                  <span className="font-bold">Product Name: </span>
                  {item?.productName}
                </h1>
                <h1>
                  <span className="font-bold">MRP Price: </span>₹{item?.mrp}
                </h1>
                <h1>
                  <span className="font-bold">Sale Price: </span>₹
                  {item?.salesRate}
                </h1>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
