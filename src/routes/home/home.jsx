import { useState, useEffect } from "react";
import "./home.scss";
import axios from "axios";
import Modal from "react-modal";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { toast } from "react-toastify";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pages, setPages] = useState(1); // Set default pages to 1
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState();
  const [notesText, setNotesText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleAllData = () => {
    setFilteredData(data);
  };

  const handleArchived = () => {
    const filterData = data.filter((el) => el.is_archived);
    setFilteredData(filterData);
  };

  const handleUnarchived = () => {
    const filterData = data.filter((el) => !el.is_archived);
    setFilteredData(filterData);
  };
  const handleArchiveClick = async (node) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/calls/${node?.id}/archive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response) {
        toast.success(
          `${node?.is_archived ? "Unarchived" : "Archived"} Successfully!`
        );

        fetchData();
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }
  };
  const openModal = (data) => {
    console.log(data);
    setModalData(data);
    setModalIsOpen(true);
  };

  const handleNote = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/calls/${id}/note`,
        { content: notesText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response) {
        toast.success(`Note Added Successfully!`);
        fetchData();
      }
      closeModal();
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalData({});
    setNotesText("");
    setModalIsOpen(false);
  };

  const customStyles = {
    content: {
      top: "45%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      padding: "0",
      height: "650px",
      overflowY: "auto",
    },
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} mins ${secs} seconds`;
  };

  const convertDateString = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = String(dateObj.getFullYear());

    return `${day}-${month}-${year}`;
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/calls?offset=${offset}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // Process the response data
      const count = response?.data?.totalCount;
      setPages(Math.ceil(count / limit));
      setData(response?.data?.nodes);
      setFilteredData(response?.data?.nodes);
      setTotalCount(count);
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [offset, limit]);

  useEffect(() => {
    setOffset((currentPage - 1) * limit);
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="home-main">
      <h1 className="home-top-heading">
        Turing Technologies Frontend Test - Moazzam
      </h1>
      <div className="filter-container">
        <div className="filter-left">Filter by:</div>
        <div className="filter-right">
          <button
            className="dropdown-button dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {filter ? filter : "Status"}
          </button>
          <div
            className={open ? "dropdown-menu show" : "dropdown-menu"}
            aria-labelledby="dropdownMenuButton"
          >
            <span
              className={
                filter === "All" ? "dropdown-item selected" : "dropdown-item"
              }
              onClick={() => {
                setFilter("All");
                setOpen(false);
                handleAllData();
              }}
            >
              All
            </span>
            <span
              className={
                filter === "Archived"
                  ? "dropdown-item selected"
                  : "dropdown-item"
              }
              onClick={() => {
                setFilter("Archived");
                setOpen(false);
                handleArchived();
              }}
            >
              Archived{" "}
            </span>
            <span
              className={
                filter === "Unarchived"
                  ? "dropdown-item selected"
                  : "dropdown-item"
              }
              onClick={() => {
                setFilter("Unarchived");
                setOpen(false);
                handleUnarchived();
              }}
            >
              Unarchived{" "}
            </span>
          </div>
        </div>
      </div>
      <div className="home-main-container">
        <div className="main-container-box">
          <div className="main-container-headings">
            <span className="main-heading">Call type</span>
            <span className="main-heading">Direction</span>
            <span className="main-heading">Duration</span>
            <span className="main-heading">From</span>
            <span className="main-heading">To</span>
            <span className="main-heading">Via</span>
            <span className="main-heading">Created At</span>
            <span className="main-heading">Status</span>
            <span className="main-heading">Actions</span>
          </div>
          {filteredData.map((node) => {
            return (
              <div className="main-container-all-data" key={node.id}>
                {node.call_type === "answered" && (
                  <span
                    className="main-container-data"
                    style={{ color: "green" }}
                  >
                    Answered{" "}
                  </span>
                )}
                {node.call_type === "voicemail" && (
                  <span
                    className="main-container-data"
                    style={{ color: "blue" }}
                  >
                    Voice Mail{" "}
                  </span>
                )}
                {node.call_type === "missed" && (
                  <span
                    className="main-container-data"
                    style={{ color: "red" }}
                  >
                    Missed{" "}
                  </span>
                )}
                <span className="main-container-data" style={{ color: "blue" }}>
                  {node.direction === "inbound" ? "Inbound" : "Outbound"}{" "}
                </span>
                <span className="main-container-data">
                  {formatTime(node.duration)}
                  <br />{" "}
                  <span style={{ color: "blue" }}>
                    ({node.duration} seconds)
                  </span>
                </span>
                <span className="main-container-data">{node.from} </span>
                <span className="main-container-data">{node.to} </span>
                <span className="main-container-data">{node.via} </span>
                <span className="main-container-data">
                  {convertDateString(node.created_at)}{" "}
                </span>
                <span
                  className="main-container-data"
                  onClick={() => handleArchiveClick(node)}
                  style={{ cursor: "pointer" }}
                >
                  {node.is_archived ? (
                    <span className="archived">Archived</span>
                  ) : (
                    <span className="unarchived">Unarchive</span>
                  )}{" "}
                </span>
                <span className="main-container-data">
                  <span className="action" onClick={() => openModal(node)}>
                    Add Note
                  </span>{" "}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pagination-container">
        <Stack spacing={2}>
          <Pagination
            count={pages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            siblingCount={3}
          />
        </Stack>
        <div className="results">
          {`${offset + 1} -- ${
            offset + limit > totalCount ? totalCount : offset + limit
          } of ${totalCount} results`}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <div className="note-main-container">
          <div className="note-container-top">
            <div>
              <h1 className="note-header">Add Notes</h1>
              <span className="call-id">Call Id: {modalData?.id}</span>
            </div>
            <span className="cross-icon" onClick={() => closeModal()}>
              X
            </span>
          </div>
          <div className="border-modal"></div>
          <div className="notes-bottom-container">
            <div className="bottom-container-row">
              <div className="container-left-item">Call Type</div>
              <div className="container-right-item" style={{ color: "blue" }}>
                {" "}
                {modalData?.call_type === "voicemail" && "Voice Mail"}
              </div>
              <div className="container-right-item" style={{ color: "red" }}>
                {" "}
                {modalData?.call_type === "missed" && "Missed"}
              </div>
              <div className="container-right-item" style={{ color: "green" }}>
                {" "}
                {modalData?.call_type === "answered" && "Answered"}
              </div>
            </div>
            <div className="bottom-container-row">
              <div className="container-left-item">Duration</div>
              <div className="container-right-item">
                {" "}
                {modalData?.duration && formatTime(modalData?.duration)}
              </div>
            </div>
            <div className="bottom-container-row">
              <div className="container-left-item">From</div>
              <div className="container-right-item"> {modalData?.from}</div>
            </div>
            <div className="bottom-container-row">
              <div className="container-left-item">To</div>
              <div className="container-right-item"> {modalData?.to}</div>
            </div>
            <div className="bottom-container-row">
              <div className="container-left-item">Via</div>
              <div className="container-right-item"> {modalData?.via}</div>
            </div>
            <div className="notes">Notes</div>
            <textarea
              rows="5"
              placeholder="Add Notes"
              value={notesText}
              onChange={(event) => setNotesText(event.target.value)}
              style={{ width: "100%", padding: "10px" }}
            />
            Notes:
            {modalData?.notes?.map((el, index) => (
              <div key={el.id}>
                {index + 1}: {el.content}
              </div>
            ))}
          </div>
          <div className="border-modal"></div>
        </div>{" "}
        <div style={{ padding: "0 30px", marginBottom: "20px" }}>
          <div
            className="save-button"
            onClick={() => handleNote(modalData?.id)}
          >
            Save
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
