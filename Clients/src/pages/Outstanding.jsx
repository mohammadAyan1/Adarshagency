import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import FilterModal from "./outstanding/FilterModal";
import NameSelectModal from "./outstanding/NameSelectModals";
import { useDispatch, useSelector } from "react-redux";

import { getAllBeats } from "../redux/features/customer/customerThunks";
import { fetchSalesmen } from "../redux/features/salesMan/salesManThunks";
import {
  fetchInvoicesByBeat,
  fetchInvoicesBySalesman,
} from "../redux/features/product-bill/invoiceThunks";

const Outstanding = () => {
  const [showFilterModal, setShowFilterModal] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    invoices: salesmanInvoices,
    totalPendingAmount: salesmanTotal,
    count: salesmanCount,
  } = useSelector((s) => s?.invoice?.invoicesBySalesman || {});

  const {
    invoices: areaWiseInvoices,
    totalPendingAmount: areaWiseTotal,
    count: areaWiseCount,
  } = useSelector((s) => s?.invoice?.areaWise || {});

  const tableData =
    selectedType === "mrwise"
      ? salesmanInvoices
      : selectedType === "areawise"
      ? areaWiseInvoices?.length > 0
        ? areaWiseInvoices
        : [
            {
              invoice: "DUMMY/AREA001",
              date: "21-07-25",
              partyName: "DEMO AREA PARTY",
              billValue: "12345.00",
              paid: "10000.00",
              balance: "2345.00",
              day: "15",
            },
          ]
      : [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBeats());
    dispatch(fetchSalesmen());
  }, [dispatch]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (selectedType) {
      setShowFilterModal(false);
      setShowNameModal(true);
    } else {
      alert("Please select Type.");
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();

    if (selectedName?.id) {
      if (selectedType === "mrwise") {
        dispatch(fetchInvoicesBySalesman(selectedName.id));
      } else if (selectedType === "areawise") {
        dispatch(
          fetchInvoicesByBeat({
            beatId: selectedName.id,
            beatName: selectedName.name,
          })
        );
      } else {
        alert("Unknown type selected!");
      }

      setShowNameModal(false);
    } else {
      alert("Please select a name.");
    }
  };

  const totalBillValue =
    selectedType === "mrwise"
      ? salesmanTotal?.toFixed(2)
      : selectedType === "areawise"
      ? areaWiseTotal?.toFixed(2)
      : "0.00";

  return (
    <div className='p-3'>
      <FilterModal
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        onSubmit={handleFilterSubmit}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <NameSelectModal
        show={showNameModal}
        onHide={() => {
          setShowNameModal(false);
          setShowFilterModal(true);
        }}
        onSubmit={handleNameSubmit}
        selectedType={selectedType}
        selectedName={selectedName}
        setSelectedName={setSelectedName}
      />

      {!showFilterModal && !showNameModal && (
        <>
          <h5 className='text-center fw-bold mb-0 py-2'>
            SAMRIDHI ENTERPRISES
          </h5>
          <h3 className='text-center fw-bold mb-0 py-2'>
            {selectedName?.name?.toUpperCase()} OUTSTANDING{" "}
            {startDate && endDate
              ? `FROM ${new Date(startDate).toLocaleDateString(
                  "en-GB"
                )} TO ${new Date(endDate).toLocaleDateString("en-GB")}`
              : startDate
              ? `FROM ${new Date(startDate).toLocaleDateString("en-GB")}`
              : endDate
              ? `TO ${new Date(endDate).toLocaleDateString("en-GB")}`
              : ""}
          </h3>

          <Table bordered responsive>
            <thead>
              <tr className='text-center fw-bold'>
                <th colSpan={1}>TOTAL NO.</th>
                <th colSpan={2}>
                  BILLS :{" "}
                  {selectedType === "mrwise" ? salesmanCount : areaWiseCount}
                </th>
                <th colSpan={2}>GRAND TOTAL : </th>
                <th>{totalBillValue}</th>
                <th colSpan={4}></th>
              </tr>
              <tr className='text-center border'>
                <th>Sr No.</th>
                <th>DATE</th>
                <th>PARTY NAME</th>
                <th>BILL VALUE</th>
                <th>PAID</th>
                <th>BALANCE</th>
                <th>DAY</th>
                <th>REMARK</th>
                <th>REMARK</th>
              </tr>
            </thead>
            <tbody>
              {tableData &&
                tableData.map((row, index) => (
                  <tr key={index} className='text-center'>
                    <td>{index + 1}</td>
                    <td>{dayjs(row.billDate).format("DD-MM-YYYY")}</td>
                    <td>{row.customerName}</td>
                    <td>{row.billValue}</td>
                    <td>{row.ledgerAmount}</td>
                    <td>{row.pendingAmount}</td>
                    <td
                      style={{
                        color: row.daysPending > 30 ? "red" : "inherit",
                        fontWeight: row.daysPending > 30 ? "bold" : "normal",
                      }}
                    >
                      {row.daysPending}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Outstanding;
