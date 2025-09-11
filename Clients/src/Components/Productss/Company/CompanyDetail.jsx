import React, { useState, useEffect, useRef } from "react";
import axios from "../../../Config/axios";
import { Tab, Tabs, Modal, Button, Table, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import AddTask from "./AddCompany";
import toast from "react-hot-toast";
import Loader from "../../Loader";

const CompanyDetail = () => {
  // State
  const [activeTab, setActiveTab] = useState("view");
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [editBrandName, setEditBrandName] = useState(null);

  // Tasks / pagination placeholders
  const [tasks] = useState([
    {
      id: 1,
      financialProduct: "",
      companyName: "",
      employee: "",
      taskName: "",
      description: "",
      checklist: "",
      sms: "",
      email: ``,
      whatsapp: "",
    },
    {
      id: 2,
      financialProduct: "Life Insurance",
      companyName: "LIC OF INDIA",
      employee: "OE",
      taskName: "Ankit",
      description: "Ankit Testing",
      checklist: "check 2",
      sms: "sms",
      email: "email",
      whatsapp: "whatsapp",
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = tasks.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(tasks.length / entriesPerPage);

  // Modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Refs
  const searchRef = useRef(null);
  const rowRefs = useRef([]);
  const brandNameCellRefs = useRef([]);

  // Fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/company");
      console.log(res);
      const data = res.data || [];
      setCompanies(data);
      setFilteredCompanies(
        searchTerm
          ? data.filter((c) =>
              (c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
            )
          : data
      );
      setSelectedRow((prev) => {
        if (data.length === 0) return null;
        if (prev === null) return 0;
        if (prev >= data.length) return data.length - 1;
        return prev;
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // Initial mount
  useEffect(() => {
    setActiveTab("view");
    fetchCompanies();
  }, []);

  // Filter when searchTerm or companies changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredCompanies(
        companies.filter((c) => (c.name || "").toLowerCase().includes(lower))
      );
    }
  }, [searchTerm, companies]);

  // Keep selection valid
  useEffect(() => {
    if (selectedRow !== null) {
      if (filteredCompanies.length === 0) {
        setSelectedRow(null);
      } else if (selectedRow >= filteredCompanies.length) {
        setSelectedRow(filteredCompanies.length - 1);
      }
    }
  }, [filteredCompanies, selectedRow]);

  // Focus management for view tab: always have something focused
  useEffect(() => {
    if (activeTab === "view") {
      if (
        selectedRow !== null &&
        brandNameCellRefs.current[selectedRow] &&
        filteredCompanies.length > 0
      ) {
        brandNameCellRefs.current[selectedRow].focus();
      } else if (searchRef.current) {
        searchRef.current.focus();
      }
    }
    if (activeTab === "add") {
      // try to focus an input inside AddTask: first look for id fallback
      setTimeout(() => {
        const addInput = document.getElementById("brand-name-input");
        if (addInput) {
          addInput.focus();
        } else {
          // fallback: first focusable in that panel
          const panel = document.querySelector('[aria-labelledby="task-tabs"]');
          if (panel) {
            const first = panel.querySelector(
              'input, button, select, textarea,[tabindex]:not([tabindex="-1"])'
            );
            if (first) first.focus();
          }
        }
      }, 50);
    }
  }, [activeTab, selectedRow, filteredCompanies]);

  // Highlight and scroll selected row
  useEffect(() => {
    rowRefs.current.forEach((r, idx) => {
      if (r) {
        if (idx === selectedRow) {
          r.classList.add("table-active");
          r.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
          if (brandNameCellRefs.current[idx]) {
            brandNameCellRefs.current[idx].focus();
          }
        } else {
          r.classList.remove("table-active");
        }
      }
    });
  }, [selectedRow]);

  // Delete company
  const deleteCompany = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/company/${id}`);
      alert("Company deleted");
      await fetchCompanies();
      setSearchTerm("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete company");
    } finally {
      setLoading(false);
    }
  };

  // Keyboard-first handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isTextInput =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true");

      // Tab switching
      if (e.key === "ArrowRight") {
        if (activeTab === "view") setActiveTab("add");
      } else if (e.key === "ArrowLeft") {
        if (activeTab === "add") setActiveTab("view");
      }

      if (activeTab === "view") {
        // Funnel typing into search if not inside input
        if (!isTextInput) {
          if (
            (e.key.length === 1 && !e.ctrlKey && !e.metaKey) ||
            e.key === "Backspace"
          ) {
            e.preventDefault();
            if (searchRef.current) searchRef.current.focus();
            setTimeout(() => {
              if (e.key === "Backspace") {
                setSearchTerm((prev) => prev.slice(0, -1));
              } else {
                setSearchTerm((prev) => prev + e.key);
              }
            }, 0);
            return;
          }
        }

        if (e.key === "/") {
          e.preventDefault();
          if (searchRef.current) searchRef.current.focus();
          return;
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (filteredCompanies.length === 0) return;
          setSelectedRow((prev) => {
            const next =
              prev === null
                ? 0
                : Math.min(prev + 1, filteredCompanies.length - 1);
            return next;
          });
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (filteredCompanies.length === 0) return;
          setSelectedRow((prev) => {
            const next = prev === null ? 0 : Math.max(prev - 1, 0);
            return next;
          });
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (activeEl === searchRef.current) {
            if (filteredCompanies.length > 0) setSelectedRow(0);
            return;
          }
          if (selectedRow !== null && filteredCompanies[selectedRow]) {
            const company = filteredCompanies[selectedRow];
            if (
              window.confirm(
                `Delete company "${company.name}"? This cannot be undone.`
              )
            ) {
              deleteCompany(company._id);
            }
          }
          return;
        }
      } else if (activeTab === "add") {
        // Funnel typing into brand name input by id
        if (!isTextInput) {
          if (
            (e.key.length === 1 && !e.ctrlKey && !e.metaKey) ||
            e.key === "Backspace"
          ) {
            const brandInput = document.getElementById("brand-name-input");
            if (brandInput) {
              brandInput.focus();
              // let native input handle the key (no preventDefault)
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, filteredCompanies, selectedRow]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mt-2 mb-4">
      <h4>Create Brand</h4>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-primary card-outline">
            <div style={{ backgroundColor: "" }} className="card-header">
              <Tabs
                id="task-tabs"
                activeKey={activeTab}
                onSelect={(k) => {
                  if (k) setActiveTab(k);
                }}
                className="mb-3"
              >
                <Tab eventKey="view" title={<b>View Brand</b>} />
                <Tab eventKey="add" title={<b>Add Brand</b>} />
              </Tabs>
            </div>

            <div className="card-body">
              {activeTab === "view" && (
                <div className="table-responsive">
                  <div className="row mb-6 py-2 dataTables_filter">
                    <label>
                      Search:
                      <input
                        type="search"
                        ref={(el) => {
                          searchRef.current = el;
                        }}
                        className="form-control form-control-sm"
                        placeholder='Type "/" or start typing to search'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (filteredCompanies.length > 0) {
                              setSelectedRow(0);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Brand Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompanies.map((c, idx) => (
                        <tr
                          key={c._id}
                          ref={(el) => (rowRefs.current[idx] = el)}
                          onClick={() => setSelectedRow(idx)}
                          style={{ cursor: "pointer" }}
                        >
                          <td
                            tabIndex={0}
                            ref={(el) => (brandNameCellRefs.current[idx] = el)}
                          >
                            {c.name}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCompany(c._id);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm bg-info px-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditBrandName(c);
                                setActiveTab("add");
                              }}
                            >
                              Edit
                            </button>
                          </td>
                          {/* <td>
                            <button
                              className='bg-black text-white px-3 py-1 rounded '
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCompany(c._id);
                              }}
                            >
                              Edit
                            </button>
                          </td> */}
                        </tr>
                      ))}
                      {filteredCompanies.length === 0 && (
                        <tr>
                          <td colSpan={2} className="text-center">
                            No brands available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  <div className="row">
                    <div className="col-sm-5">
                      <div className="dataTables_info">
                        Showing {indexOfFirstEntry + 1} to{" "}
                        {Math.min(indexOfLastEntry, tasks.length)} of{" "}
                        {tasks.length} entries
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <Pagination className="float-right">
                        <Pagination.Prev
                          disabled={currentPage === 1}
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                        />
                        {[...Array(totalPages)].map((_, i) => (
                          <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next
                          disabled={currentPage === totalPages}
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                        />
                      </Pagination>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "add" && (
                <div>
                  <AddTask
                    fetchCompanies={fetchCompanies}
                    setActiveTab={setActiveTab}
                    edit={editBrandName}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{currentTask?.taskName || ""} Description</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTask?.description || "No description available"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showChecklistModal}
        onHide={() => setShowChecklistModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{currentTask?.taskName || ""} Checklist</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>
            <center>
              <h5>{currentTask?.checklist || "No checklist available"}</h5>
            </center>
          </b>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowChecklistModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSmsModal} onHide={() => setShowSmsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{currentTask?.taskName || ""} SMS</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTask?.sms || "No SMS template available"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSmsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEmailModal}
        onHide={() => setShowEmailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{currentTask?.taskName || ""} EMAIL</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            dangerouslySetInnerHTML={{
              __html: currentTask?.email || "No email template available",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompanyDetail;
