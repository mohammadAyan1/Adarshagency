import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import PurchaseForm from "../Components/SalesMan/PurchaseForm";
import PurchaseList from "../Components/SalesMan/purchaseModel/PurchaseList";

const PurchaseTabs = () => {
  const [activeKey, setActiveKey] = useState("form");
  const [editId, setEditId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleEdit = (id) => {
    setEditId(id);
    setActiveKey("form");
  };

  const handleSuccess = () => {
    setEditId(null);
    setRefreshList((prev) => !prev);
    setActiveKey("list");
  };

  return (
    <div className=' mt-4'>
      <Tabs
        id='purchase-tabs'
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
        className='mb-3'
        justify
      >
        <Tab eventKey='form' title={editId ? "Edit Purchase" : "Add Purchase"}>
          <PurchaseForm idToEdit={editId} onSuccess={handleSuccess} />
        </Tab>

        <Tab eventKey='list' title='Purchase List'>
          <PurchaseList onEdit={handleEdit} refreshTrigger={refreshList} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default PurchaseTabs;
