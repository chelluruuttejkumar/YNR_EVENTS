import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/admin.css";

const API_URL = "http://localhost:5000/api/enquiries";

const statuses = [
  "All",
  "New",
  "Contacted",
  "Confirmed",
  "Cancelled",
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  // ===============================
  // FETCH ENQUIRIES
  // ===============================

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load enquiries"
        );
      }

      setEnquiries(result.data || []);
    } catch (err) {
      console.error("Fetch enquiries error:", err);
      setError("Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("ynr_admin_session");

      await supabase.auth.signOut();

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      sessionStorage.removeItem("ynr_admin_session");

      navigate("/admin/login", {
        replace: true,
      });
    }
  };

  // ===============================
  // UPDATE STATUS
  // ===============================

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
          result.message || "Unable to update status"
        );
      }

      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        )
      );

      if (selected?.id === id) {
        setSelected((prev) => ({
          ...prev,
          status,
        }));
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Unable to update status.");
    }
  };

  // ===============================
  // DELETE ENQUIRY
  // ===============================

  const deleteEnquiry = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to delete enquiry"
        );
      }

      setEnquiries((prev) =>
        prev.filter((item) => item.id !== id)
      );

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err) {
      console.error("Delete enquiry error:", err);
      alert("Unable to delete enquiry.");
    }
  };

  // ===============================
  // EVENT TYPES
  // ===============================

  const eventTypes = useMemo(() => {
    return [
      "All",
      ...new Set(
        enquiries
          .map((item) => item.event_type)
          .filter(Boolean)
      ),
    ];
  }, [enquiries]);

  // ===============================
  // FILTER
  // ===============================

  const filteredEnquiries = useMemo(() => {
    const query = search.toLowerCase().trim();

    return enquiries.filter((item) => {
      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.event_type?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (item.status || "New") === statusFilter;

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

  // ===============================
  // STATS
  // ===============================

  const stats = {
    total: enquiries.length,

    new: enquiries.filter(
      (item) =>
        !item.status ||
        item.status === "New"
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
  };

  // ===============================
  // RENDER
  // ===============================

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* ================= HEADER ================= */}

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
              Manage your event enquiries and
              customer requests.
            </p>
          </div>

          <div className="admin-header-actions">

            <button
              className="admin-refresh"
              onClick={fetchEnquiries}
              type="button"
            >
              ↻ Refresh
            </button>

            <button
              className="admin-logout"
              onClick={handleLogout}
              type="button"
            >
              Logout ↗
            </button>

          </div>

        </header>

        {/* ================= STATS ================= */}

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
            <span>Cancelled</span>
            <strong>{stats.cancelled}</strong>
          </div>

        </section>

        {/* ================= FILTERS ================= */}

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

        {/* ================= ERROR ================= */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* ================= TABLE ================= */}

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
                New customer enquiries will
                appear here.
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
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredEnquiries.map((item) => {

                    const currentStatus =
                      item.status || "New";

                    return (
                      <tr key={item.id}>

                        <td>

                          <div className="customer-cell">

                            <strong>
                              {item.name}
                            </strong>

                            <small>
                              {item.phone}
                            </small>

                          </div>

                        </td>

                        <td>
                          {item.event_type || "—"}
                        </td>

                        <td>
                          {item.event_date || "—"}
                        </td>

                        <td>
                          {item.guests || "—"}
                        </td>

                        <td>
                          {item.location || "—"}
                        </td>

                        <td>

                          <select
                            className={`status-select status-${currentStatus
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            value={currentStatus}
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
                                  status !== "All"
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

                        <td>

                          <div className="table-actions">

                            <button
                              type="button"
                              onClick={() =>
                                setSelected(item)
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
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
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

      {/* ================= DETAILS MODAL ================= */}

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
              type="button"
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
              {selected.name}
            </h2>

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

            </div>

            <div className="message-box">

              <span>
                MESSAGE
              </span>

              <p>
                {selected.message ||
                  "No message provided."}
              </p>

            </div>

            <div className="modal-footer">

              <a
                href={`tel:${selected.phone}`}
                className="call-customer"
              >
                Call Customer
              </a>

              {selected.email && (
                <a
                  href={`mailto:${selected.email}`}
                  className="call-customer"
                >
                  Email Customer
                </a>
              )}

              <button
                type="button"
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