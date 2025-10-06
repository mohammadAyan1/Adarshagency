import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Config/axios";
import Header from "./Header1";

const PendingBillsModal = ({
  show,
  onHide,
  onBillSelect,
  bills = [],
  amountBill,
  setBillAdjust,
  setDebitAmount,
  debitAmount,
  billAjust,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [balanceType, setBalanceType] = useState("new"); // default: new balance

  // const navigate = useNavigate();

  const pendingBills = bills.invoices?.length ? bills.invoices : [];

  useEffect(() => {
    if (show) {
      setSelectedIndex(0);
    }
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
    if (debitAmount > 0) {
      console.log(amountBill, "this is amount b8lll");

      const payload = {
        invoiceId: id,
        amount: Number(amountBill),
      };
      console.log(id);
      try {
        const res = await axiosInstance.post("/pro-billing/adjust", payload);
        const adjustedAmount = Number(res.data?.adjustedAmount || 0);
        console.log(adjustedAmount);

        if (res.data?.adjustedAmount > 0) {
          setBillAdjust((prev) => [...prev, res.data]);
          setDebitAmount((prev) => Math.max(prev - adjustedAmount, 0)); // ✅ safely update the displaye
        }
        alert("Payment adjusted successfully");
        onHide();
      } catch (error) {
        console.error("Error saving adjustment:", error);
        alert("Failed to save adjustment");
      }
    } else {
      alert("Your debited Amount is Zero");
    }
  };

  console.log(pendingBills);

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Header />
      <Modal.Header
        style={{ backgroundColor: "#3C6360" }}
        closeButton
        className="bg-bg-success"
      >
        <Modal.Title className="text-white">PENDING INVOICE</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pending-modal-body">
        <div className="d-flex justify-content-between">
          <input
            type="number d-flex justify-content-center align-items-center"
            readOnly
            value={`₹${Number(debitAmount)?.toFixed(2)}`}
            className="h-25 text-end"
          />
          {/* <div>
            <label htmlFor="balance" className="me-2">
              Select Balance:
            </label>
            <select
              id="balance"
              value={balanceType}
              onChange={(e) => setBalanceType(e.target.value)}
            >
              <option value="old">Old Balance</option>
              <option value="new">New Balance</option>
            </select>

            <p className="mt-2">
              Selected: {balanceType === "old" ? "Old Balance" : "New Balance"}
            </p>
          </div> */}
        </div>
        <div className="pending-table-wrapper">
          <div className="pending-table-header">
            <span>INVOICE NO.</span>
            <span>INV. AMOUNT</span>
            <span>BILL DATE</span>
            <span>DUE DATE</span>
            <span>DAYS</span>
            <span>BALANCE</span>
            <span>AMOUNT</span>
          </div>
          {pendingBills.length > 0 ? (
            pendingBills.map((bill, index) => {
              console.log("====================================");
              console.log(bill);
              console.log("====================================");
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
                  className={`pending-row ${isSelected ? "active-row" : ""}`}
                >
                  <span>{bill?.invoiceNo}</span>
                  <span>
                    {balance.toFixed(2)} {bill?.type}
                  </span>
                  <span>{formatDate(bill?.billDate)}</span>
                  <span>{formatDate(bill?.dueDate)}</span>
                  <span>{daysDiff}</span>
                  <span>
                    {balance.toFixed(2)} {bill?.type}
                  </span>
                  <span>
                    <button
                      className="select-btn"
                      onClick={() => {
                        handleSave(bill?._id);
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
            <div className="pending-empty">No pending bills available.</div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PendingBillsModal;
