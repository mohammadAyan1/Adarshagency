import React, { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useModal } from "./global/ModalContext";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseBill } from "../redux/features/PurchaseBill/purchaseThunk";
import { useNavigate } from "react-router-dom";
const ModifyBill = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [billType, setBillType] = useState("vendor");
  const [data, setData] = useState([]);
  const { PurchaseInvoice } = useSelector((state) => state.purchaseBillInvoice);

  const { clodeModifyBill, modifyBill } = useModal();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPurchaseBill());
  }, [dispatch]);

  console.log(PurchaseInvoice);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = PurchaseInvoice.filter((b) =>
      b.entryNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filtered);
  };

  const handleEditInvoice = (id) => {
    navigate(`/purchase/${id}`);
    clodeModifyBill();
  };

  return (
    <Modal show={modifyBill} onHide={clodeModifyBill} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modify Bill</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Search + Dropdown */}
        <Form onSubmit={handleSearch} className="mb-3 d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Form.Select
            value={billType}
            onChange={(e) => setBillType(e.target.value)}
          >
            <option value="vendor">Vendor Bill</option>
            <option value="customer">Customer Bill</option>
          </Form.Select>

          <Button variant="primary" type="submit">
            Search
          </Button>
        </Form>

        {/* Table */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Bill Entry Number</th>
              <th>Total Amount</th>
              <th>Pending</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No bills found
                </td>
              </tr>
            ) : (
              data.map((bill, index) => (
                <tr key={bill.id} onClick={() => handleEditInvoice(bill._id)}>
                  <td>{index + 1}</td>
                  <td>{bill.entryNumber}</td>
                  <td>₹{bill.finalAmount}</td>
                  <td>{bill.pendingAmount}</td>
                  <td>{bill.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={clodeModifyBill}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModifyBill;
