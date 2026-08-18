import { useEffect, useMemo, useState } from "react";
import "../styles/admin.css";

const API_URL = import.meta.env.VITE_API_URL || "https://ynr-events.onrender.com/api/enquiries";

const statuses = [
  "All",
  "New",
  "Contacted",
  "Confirmed",
  "Cancelled",
];

function AdminDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  // =====================================
  // FETCH ENQUIRIES
  // =====================================

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load enquiries."
        );
      }

      setEnquiries(result.data || []);
    } catch (err) {
      console.error("❌ Fetch enquiries error:", err);
      setError("Unable to load enquiries.");
      alert(err.message || "Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminAuthenticated");

    window.location.href = "/admin/login";
  };

  // =====================================
  // UPDATE STATUS
  // =====================================

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to update status."
        );
      }

      const updatedStatus =
        result.data?.status || status;

      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: updatedStatus,
              }
            : item
        )
      );

      if (selected?.id === id) {
        setSelected((prev) => ({
          ...prev,
          status: updatedStatus,
        }));
      }
    } catch (err) {
      console.error(
        "❌ Status update error:",
        err
      );

      alert(
        err.message || "Unable to update status."
      );
    }
  };

  // =====================================
  // DELETE ENQUIRY
  // =====================================

  const deleteEnquiry = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to delete enquiry."
        );
      }

      setEnquiries((prev) =>
        prev.filter((item) => item.id !== id)
      );

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err) {
      console.error(
        "❌ Delete enquiry error:",
        err
      );

      alert(
        err.message ||
          "Unable to delete enquiry."
      );
    }
  };

  // =====================================
  // EVENT FILTER OPTIONS
  // =====================================

  const eventTypes = useMemo(() => {
    const uniqueEvents = [
      ...new Set(
        enquiries
          .map((item) => item.event_type)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueEvents];
  }, [enquiries]);

  // =====================================
  // FILTERED ENQUIRIES
  // =====================================

  const filteredEnquiries = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return enquiries.filter((item) => {
      const matchesSearch =
        !query ||
        String(item.name || "")
          .toLowerCase()
          .includes(query) ||
        String(item.phone || "")
          .toLowerCase()
          .includes(query) ||
        String(item.email || "")
          .toLowerCase()
          .includes(query) ||
        String(item.location || "")
          .toLowerCase()
          .includes(query) ||
        String(item.event_type || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesEvent =
        eventFilter === "All" ||
        item.event_type === eventFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesEvent
      );
    });
  }, [
    enquiries,
    search,
    statusFilter,
    eventFilter,
  ]);

  // =====================================
  // STATS
  // =====================================

  const stats = {
    total: enquiries.length,

    new: enquiries.filter(
      (item) => item.status === "New"
    ).length,

    contacted: enquiries.filter(
      (item) => item.status === "Contacted"
    ).length,

    confirmed: enquiries.filter(
      (item) => item.status === "Confirmed"
    ).length,

    cancelled: enquiries.filter(
      (item) => item.status === "Cancelled"
    ).length,

    paid: enquiries.filter(
      (item) =>
        String(item.payment_status || "")
          .toLowerCase() === "paid"
    ).length,
  };

  // =====================================
  // STATUS CLASS
  // =====================================

  const getStatusClass = (status) => {
    return `status-select status-${String(
      status || "New"
    )
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  // =====================================
  // PAYMENT STATUS CLASS
  // =====================================

  const getPaymentClass = (status) => {
    return String(status || "")
      .toLowerCase() === "paid"
      ? "payment-badge payment-paid"
      : "payment-badge payment-pending";
  };

  // =====================================
  // PAYMENT STATUS TEXT
  // =====================================

  const getPaymentStatus = (item) => {
    return item.payment_status || "Pending";
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">
              YNR EVENTS · ADMIN
            </p>

            <h1>
              Enquiry
              <span> Dashboard.</span>
            </h1>

            <p className="admin-subtitle">
              Manage event enquiries and
              customers.
            </p>
          </div>

          <div className="admin-header-actions">

            <button
              className="admin-refresh"
              onClick={fetchEnquiries}
              disabled={loading}
            >
              ↻ Refresh
            </button>

            <button
              className="admin-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        </header>

        {/* =====================================
            STATS
        ===================================== */}

        <section className="admin-stats">

          <div className="stat-card">
            <span>Total Enquiries</span>
            <strong>{stats.total}</strong>
          </div>

          <div className="stat-card">
            <span>New</span>
            <strong>{stats.new}</strong>
          </div>

          <div className="stat-card">
            <span>Contacted</span>
            <strong>{stats.contacted}</strong>
          </div>

          <div className="stat-card">
            <span>Confirmed</span>
            <strong>{stats.confirmed}</strong>
          </div>

          <div className="stat-card">
            <span>Paid</span>
            <strong>{stats.paid}</strong>
          </div>

        </section>

        {/* =====================================
            FILTERS
        ===================================== */}

        <section className="admin-toolbar">

          <input
            type="search"
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status === "All"
                  ? "All Status"
                  : status}
              </option>
            ))}
          </select>

          <select
            value={eventFilter}
            onChange={(e) =>
              setEventFilter(e.target.value)
            }
          >
            {eventTypes.map((event) => (
              <option
                key={event}
                value={event}
              >
                {event === "All"
                  ? "All Events"
                  : event}
              </option>
            ))}
          </select>

        </section>

        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* =====================================
            TABLE
        ===================================== */}

        <section className="admin-table-card">

          <div className="table-heading">
            <div>
              <p>ENQUIRIES</p>

              <h2>
                {filteredEnquiries.length} Requests
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading">
              Loading enquiries...
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="admin-empty">

              <div>✦</div>

              <h3>
                No enquiries found
              </h3>

              <p>
                New customer enquiries
                will appear here.
              </p>

            </div>
          ) : (
            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredEnquiries.map(
                    (item) => (
                      <tr key={item.id}>

                        {/* CUSTOMER */}

                        <td>
                          <div className="customer-cell">

                            <strong>
                              {item.name ||
                                "Unknown Customer"}
                            </strong>

                            <small>
                              {item.phone ||
                                "No phone"}
                            </small>

                            {item.email && (
                              <small>
                                {item.email}
                              </small>
                            )}

                          </div>
                        </td>

                        {/* EVENT */}

                        <td>
                          {item.event_type || "—"}
                        </td>

                        {/* DATE */}

                        <td>
                          {item.event_date || "—"}
                        </td>

                        {/* GUESTS */}

                        <td>
                          {item.guests || "—"}
                        </td>

                        {/* LOCATION */}

                        <td>
                          {item.location || "—"}
                        </td>

                        {/* STATUS */}

                        <td>

                          <select
                            className={getStatusClass(
                              item.status
                            )}
                            value={
                              item.status || "New"
                            }
                            onChange={(e) =>
                              updateStatus(
                                item.id,
                                e.target.value
                              )
                            }
                          >
                            {statuses
                              .filter(
                                (status) =>
                                  status !==
                                  "All"
                              )
                              .map((status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              ))}
                          </select>

                        </td>

                        {/* =================================
                            PAYMENT STATUS ONLY

                            IMPORTANT:
                            Admin cannot make payment.
                            Customer payment is handled
                            from EnquiryForm/Razorpay.
                        ================================= */}

                        <td>

                          <div className="payment-cell">

                            <span
                              className={getPaymentClass(
                                item.payment_status
                              )}
                            >
                              {getPaymentStatus(item)}
                            </span>

                            {String(
                              item.payment_status || ""
                            ).toLowerCase() ===
                              "paid" &&
                              item.payment_amount && (
                                <strong className="payment-amount">
                                  ₹
                                  {Number(
                                    item.payment_amount
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </strong>
                              )}

                            {String(
                              item.payment_status || ""
                            ).toLowerCase() ===
                              "paid" &&
                              item.payment_id && (
                                <small className="payment-id">
                                  {item.payment_id}
                                </small>
                              )}

                          </div>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="table-actions">

                            <button
                              onClick={() =>
                                setSelected(item)
                              }
                            >
                              View
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                deleteEnquiry(
                                  item.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>

      {/* =====================================
          DETAILS MODAL
      ===================================== */}

      {selected && (
        <div
          className="admin-modal-backdrop"
          onClick={() =>
            setSelected(null)
          }
        >

          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelected(null)
              }
            >
              ×
            </button>

            <p className="admin-eyebrow">
              ENQUIRY #{selected.id}
            </p>

            <h2>
              {selected.name ||
                "Customer"}
            </h2>

            {/* DETAILS */}

            <div className="details-grid">

              <div>
                <span>Phone</span>
                <strong>
                  {selected.phone || "—"}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {selected.email || "—"}
                </strong>
              </div>

              <div>
                <span>Event</span>
                <strong>
                  {selected.event_type || "—"}
                </strong>
              </div>

              <div>
                <span>Date</span>
                <strong>
                  {selected.event_date || "—"}
                </strong>
              </div>

              <div>
                <span>Guests</span>
                <strong>
                  {selected.guests || "—"}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {selected.location || "—"}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selected.status || "New"}
                </strong>
              </div>

              {/* PAYMENT STATUS */}

              <div>
                <span>Payment</span>

                <strong
                  className={
                    String(
                      selected.payment_status || ""
                    ).toLowerCase() === "paid"
                      ? "modal-paid"
                      : "modal-pending"
                  }
                >
                  {getPaymentStatus(selected)}
                </strong>
              </div>

              {/* PAYMENT AMOUNT */}

              {selected.payment_amount && (
                <div>
                  <span>Amount</span>

                  <strong>
                    ₹
                    {Number(
                      selected.payment_amount
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              )}

              {/* PAYMENT ID */}

              {selected.payment_id && (
                <div>
                  <span>Payment ID</span>

                  <strong>
                    {selected.payment_id}
                  </strong>
                </div>
              )}

            </div>

            {/* MESSAGE */}

            <div className="message-box">

              <span>MESSAGE</span>

              <p>
                {selected.message ||
                  "No message provided."}
              </p>

            </div>

            {/* MODAL FOOTER */}

            <div className="modal-footer">

              <a
                href={`tel:${selected.phone}`}
                className="call-customer"
              >
                Call Customer
              </a>

              <button
                onClick={() =>
                  setSelected(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
