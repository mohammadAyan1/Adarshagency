// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { Row, Col, Form, Button, Card, Modal } from "react-bootstrap";
// import toast from "react-hot-toast";
// import { BsPlusCircle } from "react-icons/bs";
// import { MdOutlineKeyboardHide } from "react-icons/md";
// import Loader from "../Loader";
// import axios from "../../Config/axios";
// import Product from "../Productss/CreateProduct/Product";
// import useSearchableModal from "../../Components/SearchableModal";
// import ProductModel from "./purchaseModel/ProductModel";
// import BrandModels from "./purchaseModel/BrandModels";
// import VendorModal from "./purchaseModel/VendorModel";
// import dayjs from "dayjs";
// import PartyModal from "./vendorReport/PartyModal";

// const defaultItem = {
//   productId: "",
//   companyId: "",
//   purchaseRate: "",
//   quantity: "",
//   availableQty: "",
//   totalAmount: "",
//   discountPercent: "0",
//   schemePercent: "0",
// };

// const PurchaseForm = ({ idToEdit, onSuccess }) => {
//   const [vendors, setVendors] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [focusedRowIndex, setFocusedRowIndex] = useState(null);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
//   const [editItemIndex, setEditItemIndex] = useState(null);
//   const [itemsList, setItemsList] = useState([{ ...defaultItem }]);
//   const [showPartyModal, setShowPartyModal] = useState(false);
//   const [vendorsList, setVendorsList] = useState([]);

//   const dateRef = useRef(null);
//   const vendorRef = useRef(null);
//   const brandRef = useRef(null);
//   const partyNoRef = useRef(null);

//   const [purchaseData, setPurchaseData] = useState({
//     vendorId: "",
//     date: new Date().toISOString().split("T")[0],
//     entryNumber: "",
//     partyNo: "",
//     item: { ...defaultItem },
//     companyId: "",
//   });

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "F9") {
//         e.preventDefault();
//         setShowPartyModal(true);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   const AddPartySubmit = async (party) => {
//     try {
//       // Save party in backend
//       await axios.post("/vendor", party);
//       toast.success("Party added successfully");
//       setShowPartyModal(false);
//       // refresh vendors list
//       const vRes = await axios.get("/vendor");
//       setVendors(vRes.data);
//       setVendorsList(vRes.data);
//     } catch (err) {
//       toast.error("Failed to add party");
//     }
//   };

//   // fetch products use after adding a new product to get latest products list
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("/product");
//       setProducts(res.data || []);
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//     }
//   };

//   // Fetch initial data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setLoading(true);
//       try {
//         const [vRes, cRes, pRes] = await Promise.all([
//           axios.get("/vendor"),
//           axios.get("/company"),
//           axios.get("/product"),
//         ]);
//         setVendors(vRes.data);
//         setVendorsList(vRes.data);
//         setCompanies(cRes.data);
//         setProducts(pRes.data || []);
//       } catch {
//         toast.error("Failed to fetch initial data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchEntryNumber = async () => {
//       try {
//         const res = await axios.get("/purchase/next-entry-number");
//         setPurchaseData((prev) => ({
//           ...prev,
//           entryNumber: res.data.nextEntryNumber,
//         }));
//       } catch {
//         toast.error("Failed to fetch entry number.");
//       }
//     };

//     fetchInitialData();
//     fetchEntryNumber();
//   }, []);

//   // Fetch purchase for editing
//   useEffect(() => {
//     const fetchPurchaseById = async () => {
//       if (idToEdit) {
//         setLoading(true);
//         try {
//           const { data } = await axios.get(`/purchase/${idToEdit}`);

//           console.log(data);

//           setPurchaseData({
//             vendorId: data.vendorId?._id,
//             entryNumber: data.entryNumber,
//             companyId: data.items?.[0]?.companyId || "",
//             partyNo: data.partyNo,
//             date: dayjs(data.date).format("YYYY-MM-DD"),
//             item: { ...defaultItem },
//           });
//           setItemsList(
//             data.items.map((item) => ({
//               ...item,
//               productId: item.productId._id,
//               companyId: item.companyId._id,
//             }))
//           );
//           setEditingId(data._id);
//         } catch {
//           toast.error("Failed to fetch purchase details.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchPurchaseById();
//   }, [idToEdit]);

//   // Searchable modals
//   const {
//     showModal: showVendorModal,
//     setShowModal: setShowVendorModal,
//     filterText,
//     setFilterText,
//     focusedIndex,
//     setFocusedIndex,
//     modalRef,
//     inputRef,
//     rowRefs,
//   } = useSearchableModal(vendors, "name");

//   const brandModal = useSearchableModal(companies, "name");
//   const productModal = useSearchableModal(products, "productName");

//   const handleItemChange = (e, rowIndex) => {
//     const { name, value } = e.target;
//     setItemsList((prev) => {
//       const updated = [...prev];
//       let newValue = value;

//       if (name === "quantity") {
//         const available = parseInt(updated[rowIndex].availableQty) || 0;
//         const qtyValue = parseInt(value);
//         //  Clamp between 1 and availableQty
//         if (isNaN(qtyValue) || qtyValue < 0) {
//           newValue = 0; // Prevent negative or invalid numbers
//         } else if (available && qtyValue > available) {
//           newValue = available; // Cap at available quantity
//         } else {
//           newValue = qtyValue; // Allow 0 and positive values
//         }

//         // newValue = Math.max(1, Math.min(parseInt(value) || 1, available));
//       }

//       // Prevent negative values for rate, discount%, scheme%, and total
//       if (
//         name === "purchaseRate" ||
//         name === "discountPercent" ||
//         name === "schemePercent" ||
//         name === "totalAmount"
//       ) {
//         const numValue = parseFloat(value);
//         if (numValue < 0 || isNaN(numValue)) {
//           newValue = "0";
//         } else {
//           newValue = value;
//         }
//       }

//       updated[rowIndex][name] = newValue;

//       if (name === "productId") {
//         const selectedProduct = products.find((p) => p._id === value);
//         if (selectedProduct) {
//           updated[rowIndex] = {
//             ...updated[rowIndex],
//             availableQty: selectedProduct.availableQty,
//             purchaseRate: selectedProduct.purchaseRate,
//             quantity: 1,
//             companyId: purchaseData.companyId,
//             totalAmount: "",
//             discountPercent: "0",
//             schemePercent: "0",
//           };
//         }
//       }

//       //  Recalculate total
//       const rate = parseFloat(updated[rowIndex].purchaseRate) || 0;
//       const qty = parseFloat(updated[rowIndex].quantity) || 0;
//       const dis = parseFloat(updated[rowIndex].discountPercent) || 0;
//       const scm = parseFloat(updated[rowIndex].schemePercent) || 0;

//       if (rate && qty) {
//         const finalRate = rate * (1 - dis / 100) * (1 - scm / 100);
//         const calculatedTotal = finalRate * qty;
//         updated[rowIndex].totalAmount = Math.max(0, calculatedTotal).toFixed(2);
//       }

//       return updated;
//     });
//   };

//   // Handle row key navigation
//   const handleRowKeyDown = (e, rowIndex, fieldName) => {
//     if (e.key === "Enter") {
//       e.preventDefault();

//       const form = e.target.form;
//       const focusable = Array.from(
//         form.querySelectorAll("input, select, [data-nav]")
//       ).filter((el) => !el.disabled);

//       const currentRow = e.target.closest("tr");
//       const rowFocusable = focusable.filter(
//         (el) => el.closest("tr") === currentRow
//       );
//       const currentIndex = rowFocusable.indexOf(e.target);

//       if (currentIndex === rowFocusable.length - 1) {
//         setItemsList((prev) => {
//           const updated = [...prev];
//           if (rowIndex === updated.length - 1) {
//             updated.push({ ...defaultItem });
//           }
//           return updated;
//         });

//         setTimeout(() => {
//           const allRows = form.querySelectorAll("tbody tr");
//           const newRow = allRows[allRows.length - 1];
//           const firstInput = newRow.querySelector('select[name="productId"]');
//           firstInput?.focus();
//         }, 50);
//       } else {
//         rowFocusable[currentIndex + 1]?.focus();
//       }
//     }

//     if (e.key === "Delete") {
//       e.preventDefault();
//       setItemsList((prev) => {
//         if (prev.length <= 1) return prev;
//         const updated = [...prev];
//         updated.splice(rowIndex, 1);
//         return updated;
//       });
//     }

//     if (e.key === "F2") {
//       e.preventDefault();
//       setItemsList((prev) => [...prev, { ...defaultItem }]);
//       setTimeout(() => {
//         const form = e.target.form;
//         const allRows = form.querySelectorAll("tbody tr");
//         const newRow = allRows[allRows.length - 1];
//         const firstInput = newRow.querySelector('select[name="productId"]');
//         firstInput?.focus();
//       }, 50);
//     }

//     if (e.key === "F4") {
//       e.preventDefault();
//       const form = e.target.form;
//       const allRows = form.querySelectorAll("tbody tr");
//       const currentRow = allRows[rowIndex];
//       const productSelect = currentRow.querySelector(
//         'select[name="productId"]'
//       );
//       productSelect?.focus();
//       productModal.setShowModal(true);
//     }
//   };

//   // Add Item to List
//   const addItemToList = useCallback(() => {
//     const currentItem = itemsList[itemsList.length - 1];
//     console.log("Current Item", currentItem);

//     if (
//       !currentItem.productId ||
//       !currentItem.quantity ||
//       !currentItem.purchaseRate
//     ) {
//       toast.error("Please fill all required item fields.");
//       return;
//     }

//     const itemWithBrand = {
//       ...currentItem,
//       companyId: purchaseData.companyId || currentItem.companyId,
//     };

//     if (editItemIndex !== null) {
//       const updatedItems = [...itemsList];
//       updatedItems[editItemIndex] = { ...itemWithBrand };
//       setItemsList(updatedItems);
//       setEditItemIndex(null);
//       toast.success("Item updated successfully!");
//     } else {
//       setItemsList((prev) => [
//         ...prev,
//         { ...defaultItem, companyId: purchaseData.companyId },
//       ]);
//       toast.success("Item added successfully!");
//     }

//     setPurchaseData((prev) => ({
//       ...prev,
//       item: { ...defaultItem, companyId: prev.companyId },
//     }));
//   }, [itemsList, purchaseData.companyId, editItemIndex]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       !purchaseData.vendorId ||
//       !purchaseData.partyNo ||
//       itemsList.length === 0
//     ) {
//       toast.error("Please fill all required fields.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const validItems = itemsList.filter((item) => item.productId);
//       const dataToSend = {
//         vendorId: purchaseData.vendorId,
//         date: purchaseData.date,
//         partyNo: purchaseData.partyNo,
//         entryNumber: purchaseData.entryNumber,
//         items: validItems,
//       };

//       if (idToEdit) {
//         await axios.put(`/purchase/${editingId}`, dataToSend);
//         toast.success("Purchase updated successfully.");
//       } else {
//         await axios.post("/purchase", dataToSend);
//         toast.success("Purchase saved successfully.");
//       }

//       setPurchaseData({
//         vendorId: "",
//         date: new Date().toISOString().split("T")[0],
//         entryNumber: "",
//         partyNo: "",
//         item: { ...defaultItem },
//         companyId: "",
//       });
//       setItemsList([{ ...defaultItem }]);
//       setEditingId(null);

//       // Call the onSuccess callback to switch tab and refresh list
//       if (onSuccess) {
//         onSuccess();
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.error || "Operation failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "F3") {
//         e.preventDefault();
//         const selectedProduct = products.find(
//           (p) => p._id === purchaseData.item.productId
//         );
//         setSelectedProductToEdit(selectedProduct || null);
//         setShowProductModal(true);
//       }

//       if (e.altKey && e.key.toLowerCase() === "w") {
//         e.preventDefault();
//         if (!loading) handleSubmit({ preventDefault: () => {} });
//       }

//       if (e.key === "Escape") {
//         if (showVendorModal) setShowVendorModal(false);
//         else if (brandModal.showModal) brandModal.setShowModal(false);
//         else if (productModal.showModal) productModal.setShowModal(false);
//         else if (editItemIndex !== null) {
//           setEditItemIndex(null);
//           // setPurchaseData((prev) => ({ ...prev, item: { ...defaultItem } }));
//           setPurchaseData((prev) => ({
//             ...prev,
//             item: { ...defaultItem, companyId: prev.companyId },
//           }));
//         } else if (editingId) {
//           setEditingId(null);
//           setPurchaseData({
//             vendorId: "",
//             date: new Date().toISOString().split("T")[0],
//             entryNumber: "",
//             partyNo: "",
//             item: { ...defaultItem },
//           });
//           setItemsList([{ ...defaultItem }]);
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [
//     purchaseData.item.productId,
//     showVendorModal,
//     brandModal.showModal,
//     productModal.showModal,
//     editItemIndex,
//     editingId,
//     loading,
//     products,
//   ]);

//   // Initial focus
//   useEffect(() => {
//     if (!loading && vendors.length > 0) {
//       setTimeout(() => {
//         dateRef.current?.focus();
//       }, 100);
//     }
//   }, [loading, vendors]);

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const res = await axios.get("/vendor");
//         if (res?.data) setVendorsList(res.data);
//       } catch (error) {
//         toast.error("Error fetching vendor");
//       }
//     };

//     fetchVendors();
//   }, []);

//   // Handle product selection
//   const handleProductSelect = (product, rowIndex) => {
//     setItemsList((prev) => {
//       const updated = [...prev];
//       updated[rowIndex] = {
//         ...updated[rowIndex],
//         productId: product._id,
//         companyId: purchaseData.companyId || purchaseData.companyId || "",
//         purchaseRate: product.purchaseRate ?? "",
//         availableQty: product.availableQty ?? "",
//         quantity: updated[rowIndex].quantity || 1,
//       };

//       // ✅ calculate total when selecting
//       const rate = parseFloat(updated[rowIndex].purchaseRate) || 0;
//       const qty = parseFloat(updated[rowIndex].quantity) || 1;
//       updated[rowIndex].totalAmount = (rate * qty).toFixed(2);

//       return updated;
//     });

//     // ✅ Auto-update brand name & ID when product has company info
//     if (product.companyId?._id) {
//       setPurchaseData((prev) => ({
//         ...prev,
//         companyId: product.companyId._id, // store brand id
//       }));
//     }

//     productModal.setShowModal(false);

//     setTimeout(() => {
//       const form = document.querySelector("form");
//       const allRows = form.querySelectorAll("tbody tr");
//       const currentRow = allRows[rowIndex];
//       const qtyInput = currentRow.querySelector('input[name="quantity"]');
//       qtyInput?.focus();
//     }, 50);
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="mx-5">
//       <Card className="p-4 mb-4">
//         <h4 className="mb-3">{idToEdit ? "Edit Purchase" : "Add Purchase"}</h4>
//         <Form onSubmit={handleSubmit}>
//           {/* Vendor & Date */}
//           <Row className="mb-3 d-flex justify-content-between align-items-end">
//             <Col xs={12} sm={6} md={3}>
//               <Form.Group>
//                 <Form.Label>Party</Form.Label>
//                 <div
//                   ref={vendorRef}
//                   tabIndex={0}
//                   className="form-select"
//                   style={{
//                     cursor: "pointer",
//                     backgroundColor: "white",
//                     padding: "0.375rem 0.75rem",
//                   }}
//                   onClick={() => setShowVendorModal(true)}
//                   onFocus={() => setShowVendorModal(true)}
//                   data-nav
//                 >
//                   {vendors.find((v) => v._id === purchaseData.vendorId)?.firm ||
//                     "Select Party"}
//                 </div>
//               </Form.Group>
//             </Col>
//             <Col xs={12} sm={6} md={2} className="text-end">
//               <Form.Group>
//                 <Form.Label>Purchase Date</Form.Label>
//                 <Form.Control
//                   ref={dateRef}
//                   type="date"
//                   name="date"
//                   value={purchaseData.date}
//                   onChange={(e) =>
//                     setPurchaseData((prev) => ({
//                       ...prev,
//                       date: e.target.value,
//                     }))
//                   }
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       brandRef.current?.focus();
//                     }
//                   }}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Entry No., Brand, Party No. */}
//           <Row className="mb-3 d-flex justify-content-between align-items-end">
//             <Col xs="auto">
//               <Form.Group>
//                 <Form.Label>Entry No.</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="entryNumber"
//                   value={purchaseData.entryNumber}
//                   readOnly
//                   style={{ minWidth: "100px" }}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md="auto">
//               <Form.Group>
//                 <Form.Label>Brand</Form.Label>
//                 <Form.Control
//                   ref={brandRef}
//                   type="text"
//                   name="brand"
//                   value={
//                     companies.find((c) => c._id === purchaseData.companyId)
//                       ?.name || ""
//                   }
//                   onFocus={() => brandModal.setShowModal(true)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       partyNoRef.current?.focus();
//                     }
//                   }}
//                   readOnly
//                   data-nav
//                   placeholder="Select Brand"
//                   className="form-select"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Bill No.</Form.Label>
//                 <Form.Control
//                   ref={partyNoRef}
//                   type="text"
//                   name="partyNo"
//                   value={purchaseData.partyNo}
//                   required
//                   onChange={(e) =>
//                     setPurchaseData((prev) => ({
//                       ...prev,
//                       partyNo: e.target.value,
//                     }))
//                   }
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       const firstProductSelect = document.querySelector(
//                         'tbody tr:first-child select[name="productId"]'
//                       );
//                       if (firstProductSelect) {
//                         firstProductSelect.focus();
//                         setFocusedRowIndex(0);
//                         productModal.setShowModal(true);
//                       }
//                     }
//                   }}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Buttons */}
//           <Row className="mt-3 d-flex align-items-center justify-content-between flex-wrap">
//             <Col xs={12} md="auto" className="mb-2">
//               <div style={{ fontSize: "12px", color: "gray" }}>
//                 <span className="me-3">
//                   Press <kbd>Enter</kbd> to navigate
//                 </span>
//                 <span className="me-3">
//                   Press <kbd>F2</kbd> to add row
//                 </span>
//                 <span>
//                   Press <kbd>Esc</kbd> to cancel
//                 </span>
//                 <span>
//                   Press <kbd>F9</kbd> to Add Party
//                 </span>
//               </div>
//             </Col>
//             <Col
//               xs={12}
//               md="auto"
//               className="d-flex justify-content-end gap-2 mb-2"
//             >
//               <Button
//                 variant="primary"
//                 onClick={() => setShowProductModal(true)}
//               >
//                 <BsPlusCircle size={16} style={{ marginRight: "4px" }} />{" "}
//                 Product
//               </Button>
//               <Button variant="primary" onClick={addItemToList}>
//                 <MdOutlineKeyboardHide
//                   size={16}
//                   style={{ marginRight: "4px" }}
//                 />{" "}
//                 {editItemIndex !== null ? "Update Item" : "Add Item"}
//               </Button>
//               <Button variant="primary" onClick={() => setShowPartyModal(true)}>
//                 <BsPlusCircle size={16} style={{ marginRight: "4px" }} /> Add
//                 Party
//               </Button>
//             </Col>
//           </Row>

//           {/* Items Table */}
//           <div style={{ overflowX: "auto" }}>
//             <table className="table">
//               <thead className="table-secondary">
//                 <tr>
//                   <th>Product</th>
//                   <th>Qty</th>
//                   <th>Available Qty</th>
//                   <th>Rate</th>
//                   <th>DIS%</th>
//                   <th>SCM%</th>
//                   <th>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {itemsList.map((row, rowIndex) => (
//                   <tr key={rowIndex}>
//                     <td style={{ minWidth: "200px" }}>
//                       <Form.Control
//                         type="text"
//                         name="productId"
//                         value={
//                           products.find((p) => p._id === row.productId)
//                             ?.productName || ""
//                         }
//                         placeholder="Select Product"
//                         readOnly
//                         onFocus={() => {
//                           setFocusedRowIndex(rowIndex);
//                           productModal.setShowModal(true);
//                         }}
//                         onKeyDown={(e) =>
//                           handleRowKeyDown(e, rowIndex, "productId")
//                         }
//                         className="form-select"
//                         style={{ cursor: "pointer", backgroundColor: "white" }}
//                       />
//                     </td>
//                     {[
//                       { name: "quantity" },
//                       { name: "availableQty", readOnly: true },
//                       { name: "purchaseRate" },
//                       { name: "discountPercent" },
//                       { name: "schemePercent" },
//                       { name: "totalAmount", readOnly: true },
//                     ].map(({ name, readOnly = false }, colIndex) => (
//                       <td key={colIndex} style={{ minWidth: "150px" }}>
//                         <input
//                           type="number"
//                           name={name}
//                           value={row[name]}
//                           onChange={(e) => handleItemChange(e, rowIndex)}
//                           readOnly={readOnly}
//                           placeholder={`Enter ${name}`}
//                           className="form-control"
//                           onKeyDown={(e) => handleRowKeyDown(e, rowIndex, name)}
//                           style={{ minWidth: "100px", height: "30px" }}
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <Button
//             variant="primary"
//             type="submit"
//             className="mt-3"
//             disabled={!purchaseData.vendorId || itemsList.length === 0}
//           >
//             {editingId ? "Update Purchase" : "Save Purchase"}
//           </Button>
//         </Form>
//       </Card>

//       {/* Modals */}
//       <Modal
//         show={showProductModal}
//         onHide={() => {
//           setSelectedProductToEdit(null);
//           setShowProductModal(false);
//         }}
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {selectedProductToEdit ? "Edit Product" : "Add New Product"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Product
//             onSuccess={async () => {
//               setShowProductModal(false);
//               setSelectedProductToEdit(null);
//               await fetchProducts();
//             }}
//             onCancel={() => {
//               setShowProductModal(false);
//               setSelectedProductToEdit(null);
//             }}
//             productToEdit={selectedProductToEdit}
//           />
//         </Modal.Body>
//       </Modal>

//       {/* Vendor Modal */}
//       <VendorModal
//         showModal={showVendorModal}
//         setShowModal={setShowVendorModal}
//         filterText={filterText}
//         setFilterText={setFilterText}
//         focusedIndex={focusedIndex}
//         setFocusedIndex={setFocusedIndex}
//         modalRef={modalRef}
//         inputRef={inputRef}
//         rowRefs={rowRefs}
//         VendorList={vendorsList}
//         setPurchaseData={setPurchaseData}
//       />

//       <BrandModels
//         showModal={brandModal.showModal}
//         setShowModal={brandModal.setShowModal}
//         filterText={brandModal.filterText}
//         setFilterText={brandModal.setFilterText}
//         focusedIndex={brandModal.focusedIndex}
//         setFocusedIndex={brandModal.setFocusedIndex}
//         modalRef={brandModal.modalRef}
//         inputRef={brandModal.inputRef}
//         rowRefs={brandModal.rowRefs}
//         filteredItems={brandModal.filteredItems}
//         setPurchaseData={setPurchaseData}
//         brandRef={brandRef}
//         partyNoRef={partyNoRef}
//       />

//       <ProductModel
//         showModal={productModal.showModal}
//         setShowModal={productModal.setShowModal}
//         filterText={productModal.filterText}
//         setFilterText={productModal.setFilterText}
//         focusedIndex={productModal.focusedIndex}
//         setFocusedIndex={productModal.setFocusedIndex}
//         modalRef={productModal.modalRef}
//         inputRef={productModal.inputRef}
//         rowRefs={productModal.rowRefs}
//         filteredItems={productModal.filteredItems}
//         handleProductSelect={(product) =>
//           handleProductSelect(product, focusedRowIndex)
//         }
//       />

//       {/* Party Modal */}
//       <PartyModal
//         show={showPartyModal}
//         onHide={() => setShowPartyModal(false)}
//         onSubmit={AddPartySubmit}
//       />
//     </div>
//   );
// };

// export default PurchaseForm;

// client/src/components/PurchaseForm.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Row, Col, Form, Button, Card, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { BsPlusCircle } from "react-icons/bs";
import { MdOutlineKeyboardHide } from "react-icons/md";
import Loader from "../Loader";
import axios from "../../Config/axios";
import Product from "../Productss/CreateProduct/Product";
import useSearchableModal from "../../Components/SearchableModal";
import ProductModel from "./purchaseModel/ProductModel";
import VendorModal from "./purchaseModel/VendorModel";
import dayjs from "dayjs";
import PartyModal from "./vendorReport/PartyModal";

const defaultItem = {
  productId: "",
  purchaseRate: "",
  quantity: "",
  availableQty: "",
  totalAmount: "",
  discountPercent: "0",
  schemePercent: "0",
};

const PurchaseForm = ({ idToEdit, onSuccess }) => {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedRowIndex, setFocusedRowIndex] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [itemsList, setItemsList] = useState([{ ...defaultItem }]);
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [vendorsList, setVendorsList] = useState([]);

  const dateRef = useRef(null);
  const vendorRef = useRef(null);
  const partyNoRef = useRef(null);

  const [purchaseData, setPurchaseData] = useState({
    vendorId: "",
    date: new Date().toISOString().split("T")[0],
    entryNumber: "",
    partyNo: "",
    item: { ...defaultItem },
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F9") {
        e.preventDefault();
        setShowPartyModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const AddPartySubmit = async (party) => {
    try {
      await axios.post("/vendor", party);
      toast.success("Party added successfully");
      setShowPartyModal(false);
      const vRes = await axios.get("/vendor");
      setVendors(vRes.data);
      setVendorsList(vRes.data);
    } catch (err) {
      toast.error("Failed to add party");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/product");
      setProducts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Fetch initial data (vendors, products, entryNumber)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [vRes, pRes] = await Promise.all([
          axios.get("/vendor"),
          axios.get("/product"),
        ]);
        setVendors(vRes.data);
        setVendorsList(vRes.data);
        setProducts(pRes.data || []);
      } catch {
        toast.error("Failed to fetch initial data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchEntryNumber = async () => {
      try {
        const res = await axios.get("/purchase/next-entry-number");
        setPurchaseData((prev) => ({
          ...prev,
          entryNumber: res.data.nextEntryNumber,
        }));
      } catch {
        toast.error("Failed to fetch entry number.");
      }
    };

    fetchInitialData();
    fetchEntryNumber();
  }, []);

  // Fetch purchase for editing
  useEffect(() => {
    const fetchPurchaseById = async () => {
      if (idToEdit) {
        setLoading(true);
        try {
          const { data } = await axios.get(`/purchase/${idToEdit}`);

          // Map items: productId remains product._id, other item fields preserved
          setPurchaseData({
            vendorId: data.vendorId?._id,
            entryNumber: data.entryNumber,
            partyNo: data.partyNo,
            date: dayjs(data.date).format("YYYY-MM-DD"),
            item: { ...defaultItem },
          });

          setItemsList(
            data.items.map((item) => ({
              ...item,
              productId: item.productId._id,
              // companyId removed (we no longer track brand)
            }))
          );

          setEditingId(data._id);
        } catch {
          toast.error("Failed to fetch purchase details.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPurchaseById();
  }, [idToEdit]);

  // Searchable modals
  const {
    showModal: showVendorModal,
    setShowModal: setShowVendorModal,
    filterText,
    setFilterText,
    focusedIndex,
    setFocusedIndex,
    modalRef,
    inputRef,
    rowRefs,
  } = useSearchableModal(vendors, "name");

  const productModal = useSearchableModal(products, "productName");

  const handleItemChange = (e, rowIndex) => {
    const { name, value } = e.target;
    setItemsList((prev) => {
      const updated = [...prev];
      let newValue = value;

      if (name === "quantity") {
        const available = parseInt(updated[rowIndex].availableQty) || 0;
        const qtyValue = parseInt(value);
        if (isNaN(qtyValue) || qtyValue < 0) {
          newValue = 0;
        } else if (available && qtyValue > available) {
          newValue = available;
        } else {
          newValue = qtyValue;
        }
      }

      if (
        name === "purchaseRate" ||
        name === "discountPercent" ||
        name === "schemePercent" ||
        name === "totalAmount"
      ) {
        const numValue = parseFloat(value);
        if (numValue < 0 || isNaN(numValue)) {
          newValue = "0";
        } else {
          newValue = value;
        }
      }

      updated[rowIndex][name] = newValue;

      // If product selection happens via direct Set (not via handleProductSelect),
      // ensure recalc.
      const rate = parseFloat(updated[rowIndex].purchaseRate) || 0;
      const qty = parseFloat(updated[rowIndex].quantity) || 0;
      const dis = parseFloat(updated[rowIndex].discountPercent) || 0;
      const scm = parseFloat(updated[rowIndex].schemePercent) || 0;

      if (rate && qty) {
        const finalRate = rate * (1 - dis / 100) * (1 - scm / 100);
        const calculatedTotal = finalRate * qty;
        updated[rowIndex].totalAmount = Math.max(0, calculatedTotal).toFixed(2);
      } else {
        updated[rowIndex].totalAmount = (0).toFixed(2);
      }

      return updated;
    });
  };

  // Keyboard row navigation
  const handleRowKeyDown = (e, rowIndex, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const focusable = Array.from(
        form.querySelectorAll("input, select, [data-nav]")
      ).filter((el) => !el.disabled);

      const currentRow = e.target.closest("tr");
      const rowFocusable = focusable.filter(
        (el) => el.closest("tr") === currentRow
      );
      const currentIndex = rowFocusable.indexOf(e.target);

      if (currentIndex === rowFocusable.length - 1) {
        setItemsList((prev) => {
          const updated = [...prev];
          if (rowIndex === updated.length - 1) {
            updated.push({ ...defaultItem });
          }
          return updated;
        });

        setTimeout(() => {
          const allRows = form.querySelectorAll("tbody tr");
          const newRow = allRows[allRows.length - 1];
          const firstInput =
            newRow.querySelector('input[name="productId"]') ||
            newRow.querySelector('select[name="productId"]');
          firstInput?.focus();
        }, 50);
      } else {
        rowFocusable[currentIndex + 1]?.focus();
      }
    }

    if (e.key === "Delete") {
      e.preventDefault();
      setItemsList((prev) => {
        if (prev.length <= 1) return prev;
        const updated = [...prev];
        updated.splice(rowIndex, 1);
        return updated;
      });
    }

    if (e.key === "F2") {
      e.preventDefault();
      setItemsList((prev) => [...prev, { ...defaultItem }]);
      setTimeout(() => {
        const form = e.target.form;
        const allRows = form.querySelectorAll("tbody tr");
        const newRow = allRows[allRows.length - 1];
        const firstInput =
          newRow.querySelector('input[name="productId"]') ||
          newRow.querySelector('select[name="productId"]');
        firstInput?.focus();
      }, 50);
    }

    if (e.key === "F4") {
      e.preventDefault();
      const form = e.target.form;
      const allRows = form.querySelectorAll("tbody tr");
      const currentRow = allRows[rowIndex];
      const productSelect =
        currentRow.querySelector('input[name="productId"]') ||
        currentRow.querySelector('select[name="productId"]');
      productSelect?.focus();
      productModal.setShowModal(true);
    }
  };

  // Add / Update item
  const addItemToList = useCallback(() => {
    const currentItem = itemsList[itemsList.length - 1];

    if (
      !currentItem.productId ||
      !currentItem.quantity ||
      !currentItem.purchaseRate
    ) {
      toast.error("Please fill all required item fields.");
      return;
    }

    if (editItemIndex !== null) {
      const updatedItems = [...itemsList];
      updatedItems[editItemIndex] = { ...currentItem };
      setItemsList(updatedItems);
      setEditItemIndex(null);
      toast.success("Item updated successfully!");
    } else {
      setItemsList((prev) => [...prev, { ...defaultItem }]);
      toast.success("Item added successfully!");
    }

    setPurchaseData((prev) => ({
      ...prev,
      item: { ...defaultItem },
    }));
  }, [itemsList, editItemIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !purchaseData.vendorId ||
      !purchaseData.partyNo ||
      itemsList.length === 0
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const validItems = itemsList.filter((item) => item.productId);
      const dataToSend = {
        vendorId: purchaseData.vendorId,
        date: purchaseData.date,
        partyNo: purchaseData.partyNo,
        entryNumber: purchaseData.entryNumber,
        items: validItems,
      };

      if (idToEdit) {
        await axios.put(`/purchase/${editingId}`, dataToSend);
        toast.success("Purchase updated successfully.");
      } else {
        await axios.post("/purchase", dataToSend);
        toast.success("Purchase saved successfully.");
      }

      setPurchaseData({
        vendorId: "",
        date: new Date().toISOString().split("T")[0],
        entryNumber: "",
        partyNo: "",
        item: { ...defaultItem },
      });
      setItemsList([{ ...defaultItem }]);
      setEditingId(null);

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F3") {
        e.preventDefault();
        const selectedProduct = products.find(
          (p) => p._id === purchaseData.item.productId
        );
        setSelectedProductToEdit(selectedProduct || null);
        setShowProductModal(true);
      }

      if (e.altKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        if (!loading) handleSubmit({ preventDefault: () => {} });
      }

      if (e.key === "Escape") {
        if (showVendorModal) setShowVendorModal(false);
        else if (productModal.showModal) productModal.setShowModal(false);
        else if (editItemIndex !== null) {
          setEditItemIndex(null);
          setPurchaseData((prev) => ({ ...prev, item: { ...defaultItem } }));
        } else if (editingId) {
          setEditingId(null);
          setPurchaseData({
            vendorId: "",
            date: new Date().toISOString().split("T")[0],
            entryNumber: "",
            partyNo: "",
            item: { ...defaultItem },
          });
          setItemsList([{ ...defaultItem }]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    purchaseData.item.productId,
    showVendorModal,
    productModal.showModal,
    editItemIndex,
    editingId,
    loading,
    products,
  ]);

  // Initial focus
  useEffect(() => {
    if (!loading && vendors.length > 0) {
      setTimeout(() => {
        dateRef.current?.focus();
      }, 100);
    }
  }, [loading, vendors]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("/vendor");
        if (res?.data) setVendorsList(res.data);
      } catch (error) {
        toast.error("Error fetching vendor");
      }
    };

    fetchVendors();
  }, []);

  // Handle product selection
  const handleProductSelect = (product, rowIndex) => {
    setItemsList((prev) => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        productId: product._id,
        purchaseRate: product.purchaseRate ?? "",
        availableQty: product.availableQty ?? "",
        quantity: updated[rowIndex].quantity || 1,
      };

      const rate = parseFloat(updated[rowIndex].purchaseRate) || 0;
      const qty = parseFloat(updated[rowIndex].quantity) || 1;
      updated[rowIndex].totalAmount = (rate * qty).toFixed(2);

      return updated;
    });

    productModal.setShowModal(false);

    setTimeout(() => {
      const form = document.querySelector("form");
      const allRows = form.querySelectorAll("tbody tr");
      const currentRow = allRows[rowIndex];
      const qtyInput = currentRow.querySelector('input[name="quantity"]');
      qtyInput?.focus();
    }, 50);
  };

  if (loading) return <Loader />;

  const visibleProducts = products;

  return (
    <div className="mx-5">
      <Card className="p-4 mb-4">
        <h4 className="mb-3">{idToEdit ? "Edit Purchase" : "Add Purchase"}</h4>
        <Form onSubmit={handleSubmit}>
          {/* Vendor & Date */}
          <Row className="mb-3 d-flex justify-content-between align-items-end">
            <Col xs={12} sm={6} md={3}>
              <Form.Group>
                <Form.Label>Party</Form.Label>
                <div
                  ref={vendorRef}
                  tabIndex={0}
                  className="form-select"
                  style={{
                    cursor: "pointer",
                    backgroundColor: "white",
                    padding: "0.375rem 0.75rem",
                  }}
                  onClick={() => setShowVendorModal(true)}
                  onFocus={() => setShowVendorModal(true)}
                  data-nav
                >
                  {vendors.find((v) => v._id === purchaseData.vendorId)?.firm ||
                    "Select Party"}
                </div>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2} className="text-end">
              <Form.Group>
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control
                  ref={dateRef}
                  type="date"
                  name="date"
                  value={purchaseData.date}
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Entry No., Bill No. */}
          <Row className="mb-3 d-flex justify-content-between align-items-end">
            <Col xs="auto">
              <Form.Group>
                <Form.Label>Entry No.</Form.Label>
                <Form.Control
                  type="text"
                  name="entryNumber"
                  value={purchaseData.entryNumber}
                  readOnly
                  style={{ minWidth: "100px" }}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Bill No.</Form.Label>
                <Form.Control
                  ref={partyNoRef}
                  type="text"
                  name="partyNo"
                  value={purchaseData.partyNo}
                  required
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      partyNo: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const firstProductSelect = document.querySelector(
                        'tbody tr:first-child input[name="productId"], tbody tr:first-child select[name="productId"]'
                      );
                      if (firstProductSelect) {
                        firstProductSelect.focus();
                        setFocusedRowIndex(0);
                        productModal.setShowModal(true);
                      }
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Buttons */}
          <Row className="mt-3 d-flex align-items-center justify-content-between flex-wrap">
            <Col xs={12} md="auto" className="mb-2">
              <div style={{ fontSize: "12px", color: "gray" }}>
                <span className="me-3">
                  Press <kbd>Enter</kbd> to navigate
                </span>
                <span className="me-3">
                  Press <kbd>F2</kbd> to add row
                </span>
                <span>
                  Press <kbd>Esc</kbd> to cancel
                </span>
                <span>
                  Press <kbd>F9</kbd> to Add Party
                </span>
              </div>
            </Col>
            <Col
              xs={12}
              md="auto"
              className="d-flex justify-content-end gap-2 mb-2"
            >
              <Button
                variant="primary"
                onClick={() => setShowProductModal(true)}
              >
                <BsPlusCircle size={16} style={{ marginRight: "4px" }} />{" "}
                Product
              </Button>
              <Button variant="primary" onClick={addItemToList}>
                <MdOutlineKeyboardHide
                  size={16}
                  style={{ marginRight: "4px" }}
                />{" "}
                {editItemIndex !== null ? "Update Item" : "Add Item"}
              </Button>
              <Button variant="primary" onClick={() => setShowPartyModal(true)}>
                <BsPlusCircle size={16} style={{ marginRight: "4px" }} /> Add
                Party
              </Button>
            </Col>
          </Row>

          {/* Items Table */}
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead className="table-secondary">
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Available Qty</th>
                  <th>Rate</th>
                  <th>DIS%</th>
                  <th>SCM%</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {itemsList.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td style={{ minWidth: "200px" }}>
                      <Form.Control
                        type="text"
                        name="productId"
                        value={
                          products.find((p) => p._id === row.productId)
                            ?.productName || ""
                        }
                        placeholder="Select Product"
                        readOnly
                        onFocus={() => {
                          setFocusedRowIndex(rowIndex);
                          productModal.setShowModal(true);
                        }}
                        onKeyDown={(e) =>
                          handleRowKeyDown(e, rowIndex, "productId")
                        }
                        className="form-select"
                        style={{ cursor: "pointer", backgroundColor: "white" }}
                      />
                    </td>
                    {[
                      { name: "quantity" },
                      { name: "availableQty", readOnly: true },
                      { name: "purchaseRate" },
                      { name: "discountPercent" },
                      { name: "schemePercent" },
                      { name: "totalAmount", readOnly: true },
                    ].map(({ name, readOnly = false }, colIndex) => (
                      <td key={colIndex} style={{ minWidth: "150px" }}>
                        <input
                          type="number"
                          name={name}
                          value={row[name]}
                          onChange={(e) => handleItemChange(e, rowIndex)}
                          readOnly={readOnly}
                          placeholder={`Enter ${name}`}
                          className="form-control"
                          onKeyDown={(e) => handleRowKeyDown(e, rowIndex, name)}
                          style={{ minWidth: "100px", height: "30px" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            disabled={!purchaseData.vendorId || itemsList.length === 0}
          >
            {editingId ? "Update Purchase" : "Save Purchase"}
          </Button>
        </Form>
      </Card>

      {/* Product modal */}
      <Modal
        show={showProductModal}
        onHide={() => {
          setSelectedProductToEdit(null);
          setShowProductModal(false);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProductToEdit ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Product
            onSuccess={async () => {
              setShowProductModal(false);
              setSelectedProductToEdit(null);
              await fetchProducts();
            }}
            onCancel={() => {
              setShowProductModal(false);
              setSelectedProductToEdit(null);
            }}
            productToEdit={selectedProductToEdit}
          />
        </Modal.Body>
      </Modal>

      {/* Vendor Modal */}
      <VendorModal
        showModal={showVendorModal}
        setShowModal={setShowVendorModal}
        filterText={filterText}
        setFilterText={setFilterText}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
        modalRef={modalRef}
        inputRef={inputRef}
        rowRefs={rowRefs}
        VendorList={vendorsList}
        setPurchaseData={setPurchaseData}
      />

      <ProductModel
        showModal={productModal.showModal}
        setShowModal={productModal.setShowModal}
        filterText={productModal.filterText}
        setFilterText={productModal.setFilterText}
        focusedIndex={productModal.focusedIndex}
        setFocusedIndex={productModal.setFocusedIndex}
        modalRef={productModal.modalRef}
        inputRef={productModal.inputRef}
        rowRefs={productModal.rowRefs}
        filteredItems={productModal.filteredItems}
        handleProductSelect={(product) =>
          handleProductSelect(product, focusedRowIndex)
        }
      />

      <PartyModal
        show={showPartyModal}
        onHide={() => setShowPartyModal(false)}
        onSubmit={AddPartySubmit}
      />
    </div>
  );
};

export default PurchaseForm;
