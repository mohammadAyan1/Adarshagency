// import React, { useEffect, useState } from "react";
// import { Modal } from "react-bootstrap";
// import DataTable from "react-data-table-component";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../Config/axios";
// import { payAgainstPurchase } from "../../redux/features/purchase/purchaseThunks";
// import { useDispatch } from "react-redux";

// const PendingBillsModal = ({
//   show,
//   onHide,
//   onBillSelect,
//   bills = [],
//   amountBill,
// }) => {
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const pendingBills = bills;

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (show) {
//       setSelectedIndex(0);
//     }
//   }, [show]);

//   useEffect(() => {
//     const handleKey = (e) => {
//       if (!show || pendingBills.length === 0) return;

//       if (e.key === "ArrowDown") {
//         setSelectedIndex((prev) => (prev + 1) % pendingBills.length);
//       } else if (e.key === "ArrowUp") {
//         setSelectedIndex((prev) =>
//           prev === 0 ? pendingBills.length - 1 : prev - 1
//         );
//       } else if (e.key === "Enter") {
//         const selected = pendingBills[selectedIndex];
//         if (selected) {
//           console.log("Selected Bill ID:", selected._id.$oid); // 👈 Console me I
//           // onBillSelect(selected);
//           onBillSelect(selected._id.$oid); // Sirf ID bhejna ho to
//           onHide();
//         }
//       } else if (e.key === "Escape") {
//         onHide();
//       }
//     };

//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [show, selectedIndex, onBillSelect, onHide, pendingBills]);

//   const columns = [
//     {
//       name: "INVOICE NO.",
//       selector: (row) => row.invoiceNumber || row.entryNumber || "N/A",
//       sortable: true,
//     },
//     {
//       name: "INV_AMOUNT",
//       selector: (row) => row?.pendingAmount || 0,
//       sortable: true,
//       cell: (row) => `₹ ${row?.pendingAmount || 0}`,
//       right: true,
//     },
//     {
//       name: "BILL DATE",
//       selector: (row) => row.billDate || "N/A", // assuming billDate is in YYYY-MM-DD
//       sortable: true,
//     },
//     {
//       name: "BILL DATE",
//       selector: (row) => {
//         if (row.billDate) return row.billDate;

//         const today = new Date();
//         const day = String(today.getDate()).padStart(2, "0");
//         const month = String(today.getMonth() + 1).padStart(2, "0");
//         const year = today.getFullYear();

//         return `${day}-${month}-${year}`;
//       },
//       sortable: true,
//     },
//     {
//       name: "DUE DATE",
//       selector: (row) => row.dueDate || "N/A", // assume dueDate field
//       sortable: true,
//     },

//     {
//       name: "AMOUNT",
//       cell: (row) => (
//         <button
//           className='btn btn-sm btn-primary'
//           onClick={() => {
//             handleSave(row._id);
//             onHide();
//           }}
//         >
//           Select
//         </button>
//       ),
//       center: true,
//     },
//   ];

//   const handleSave = async (id) => {
//     console.log("📦 Saving payload:", id, amountBill);

//     const payload = {
//       vendorId: id,
//       amount: Number(amountBill),
//     };

//     try {
//       // const res = await axiosInstance.post(
//       //   "/purchase/update-pending-amount",
//       //   payload
//       // );

//       // Somewhere in your React Component

//       await dispatch(
//         payAgainstPurchase({ purchaseId: id, amount: Number(amountBill) })
//       )
//         .unwrap()
//         .then((res) => {
//           console.log("✅ Payment Success:", res);
//           alert("Payment Done!");
//         })
//         .catch((err) => {
//           console.error("❌ Payment Error:", err);
//           alert(err);
//         });

//       alert("Payment adjusted successfully");
//       onHide();
//       navigate("/");
//     } catch (error) {
//       console.error("Error saving adjustment:", error);
//       alert("Failed to save adjustment");
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} fullscreen>
//       <Modal.Header closeButton>
//         <Modal.Title>Pending Bills</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {pendingBills.length > 0 ? (
//           <DataTable
//             columns={columns}
//             data={pendingBills}
//             highlightOnHover
//             pointerOnHover
//             selectableRowsHighlight
//             defaultSortFieldId={1}
//             pagination
//           />
//         ) : (
//           <p>No pending bills available for this vendor.</p>
//         )}
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default PendingBillsModal;



import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Config/axios";
// import Header from "./Header1";
import { payAgainstPurchase } from "../../redux/features/purchase/purchaseThunks";
import { useDispatch } from "react-redux";
import Header1 from "../../pages/customer-reciept/Header1";

const dummyInvoices = [
  {
    _id: "A000137",
    invoiceNo: "A000137",
    pendingAmount: 29110,
    type: "Dr",
    billDate: "2025-04-17",
    dueDate: "2025-04-17",
  },
  {
    _id: "A000136",
    invoiceNo: "A000136",
    pendingAmount: 137226,
    type: "Dr",
    billDate: "2025-04-30",
    dueDate: "2025-04-30",
  },
  {
    _id: "CALLIM",
    invoiceNo: "CALLIM",
    pendingAmount: 1163,
    type: "Cr",
    billDate: "2025-05-01",
    dueDate: "2025-05-30",
  },
  {
    _id: "X123",
    invoiceNo: "465100422",
    pendingAmount: 62221.42,
    type: "Cr",
    billDate: "2025-04-30",
    dueDate: "2025-05-30",
  },
  {
    _id: "X124",
    invoiceNo: "465100447",
    pendingAmount: 194627.0,
    type: "Dr",
    billDate: "2025-05-16",
    dueDate: "2025-05-28",
  },
];

const PendingBillsModal = ({
  show,
  onHide,
  onBillSelect,
  bills = [],
  amountBill,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pendingBills = bills.length ? bills : dummyInvoices;

  useEffect(() => {
    if (show) setSelectedIndex(0);
  }, [show]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!show || pendingBills.length === 0) return;
      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % pendingBills.length);
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) =>
          prev === 0 ? pendingBills.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        const selected = pendingBills[selectedIndex];
        if (selected) {
          onBillSelect(selected._id);
          onHide();
        }
      } else if (e.key === "Escape") {
        onHide();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [show, selectedIndex, pendingBills]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  const handleSave = async (id) => {
    const payload = {
      purchaseId: id,
      amount: Number(amountBill),
    };
    try {
      await dispatch(payAgainstPurchase(payload))
        .unwrap()
        .then((res) => {
          console.log("✅ Payment Success:", res);
          alert("Payment Done!");
        })
        .catch((err) => {
          console.error("❌ Payment Error:", err);
          alert(err);
        });

      onHide();
      navigate("/");
    } catch (error) {
      console.error("Error saving adjustment:", error);
      alert("Failed to save adjustment");
    }
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Header1 />
      <Modal.Header
        style={{ backgroundColor: "#3C6360" }}
        closeButton
        className='bg-bg-success'
      >
        <Modal.Title className='text-white'>PENDING INVOICE</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className='px-4 py-3'
        style={{ fontFamily: "Courier New, monospace" }}
      >
        <div className='mb-3'>
          <div className='d-flex justify-content-between'>
            <div>
              <strong>SAMRIDDHI ENTERPRISES - JYOTHY</strong>
              <br />
              H.NO 2, NAGAR NIGAM COLONY COAL & TIMBER MARKET CHHOLA ROAD, BHOPAL
            </div>
          </div>
        </div>

        <div
          className='border border-dark'
          style={{ borderWidth: "2px" }}
        ></div>

        <div
          className='d-flex text-uppercase fw-bold mt-2 mb-2 px-1'
          style={{ fontSize: "13px" }}
        >
          <span style={{ width: "15%" }}>INVOICE NO.</span>
          <span style={{ width: "15%" }}>INV. AMOUNT</span>
          <span style={{ width: "15%" }}>BILL DATE</span>
          <span style={{ width: "15%" }}>DUE DATE</span>
          <span style={{ width: "10%" }}>DAYS</span>
          <span style={{ width: "15%" }}>BALANCE</span>
          <span style={{ width: "15%" }}>AMOUNT</span>
        </div>

        <div
          className='border border-dark'
          style={{ borderWidth: "1px" }}
        ></div>

        {pendingBills.length > 0 ? (
          pendingBills.map((bill, index) => {
            const isSelected = index === selectedIndex;
            const balance = bill?.pendingAmount || 0;
            const daysDiff = (() => {
              const billDate = new Date(bill?.billDate);
              const dueDate = new Date(bill?.dueDate);
              const diff = Math.floor(
                (dueDate - billDate) / (1000 * 60 * 60 * 24)
              );
              return isNaN(diff) ? "-" : diff;
            })();

            return (
              <div
                key={bill._id}
                className={`d-flex align-items-center py-2 px-1 ${
                  isSelected ? "bg-primary text-white" : ""
                }`}
                style={{ fontSize: "14px" }}
              >
                <span style={{ width: "15%" }}>
                  {bill?.invoiceNo || bill?.entryNumber || "N/A"}
                </span>
                <span style={{ width: "15%" }}>
                  {balance.toFixed(2)} {bill?.type || "Dr"}
                </span>
                <span style={{ width: "15%" }}>{formatDate(bill?.billDate)}</span>
                <span style={{ width: "15%" }}>{formatDate(bill?.dueDate)}</span>
                <span style={{ width: "10%" }}>{daysDiff}</span>
                <span style={{ width: "15%" }}>
                  {balance.toFixed(2)} {bill?.type || "Dr"}
                </span>
                <span style={{ width: "15%" }}>
                  <button
                    className={`btn btn-sm ${
                      isSelected ? "btn-light" : "btn-primary"
                    }`}
                    onClick={() => {
                      handleSave(bill._id);
                      onHide();
                    }}
                  >
                    SELECT
                  </button>
                </span>
              </div>
            );
          })
        ) : (
          <div className='text-center py-4'>No pending bills available.</div>
        )}

        <div
          className='border border-dark mt-2'
          style={{ borderWidth: "2px" }}
        ></div>
      </Modal.Body>
    </Modal>
  );
};

export default PendingBillsModal;