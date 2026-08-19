import { useState } from "react";
import "../styles/enquiry.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://ynr-events.onrender.com");

const INITIAL_FORM = {
  name: "",
  phone: "7569862230",
  email: "",
  event_type: "",
  event_date: "",
  guests: "",
  location: "",
  message: "",
};

function EnquiryForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Keeps the same enquiry for payment retries
  const [enquiryId, setEnquiryId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // LOAD RAZORPAY
  // =====================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // =====================================
  // START / RETRY PAYMENT
  // =====================================

  const startPayment = async (currentEnquiryId) => {
    try {
      setLoading(true);
      setStatus("Preparing secure payment...");

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay failed to load. Please check your internet connection."
        );
      }

      // ₹5,000 booking advance
      const amount = 5000;

      const response = await fetch(
        `${API_URL}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enquiryId: currentEnquiryId,
            amount,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to create payment order."
        );
      }

      const {
        orderId,
        amount: orderAmount,
        currency,
        keyId,
      } = result.data;

      if (!orderId || !keyId) {
        throw new Error(
          "Invalid payment order received from server."
        );
      }

      const options = {
        key: keyId,
        amount: orderAmount,
        currency,
        name: "YNR Events",
        description: "Event Booking Advance",
        order_id: orderId,

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },

        notes: {
          enquiry_id: String(currentEnquiryId),
        },

        theme: {
          color: "#111111",
        },

        // =====================================
        // PAYMENT SUCCESS
        // =====================================

        handler: async (payment) => {
          try {
            setStatus(
              "Verifying your payment..."
            );

            const verifyResponse = await fetch(
              `${API_URL}/api/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  enquiryId: currentEnquiryId,

                  razorpay_payment_id:
                    payment.razorpay_payment_id,

                  razorpay_order_id:
                    payment.razorpay_order_id,

                  razorpay_signature:
                    payment.razorpay_signature,
                }),
              }
            );

            const verifyResult =
              await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyResult.message ||
                  "Payment verification failed."
              );
            }

            setStatus(
              "success: Payment successful! Your enquiry has been confirmed."
            );

            // Payment is complete.
            // Clear the enquiry ID so retry is no longer shown.
            setEnquiryId(null);

            setFormData({
              ...INITIAL_FORM,
              phone: "7569862230",
            });
          } catch (error) {
            console.error(
              "❌ Payment verification error:",
              error
            );

            setStatus(
              "error: Payment verification failed. Your enquiry is saved. You can retry the payment."
            );

            // IMPORTANT:
            // Keep enquiryId so customer can retry.
          } finally {
            setLoading(false);
          }
        },

        // =====================================
        // PAYMENT CANCELLED
        // =====================================

        modal: {
          ondismiss: () => {
            setStatus(
              "cancelled: Payment cancelled. Your enquiry is saved. You can retry the payment below."
            );

            // IMPORTANT:
            // Do NOT clear enquiryId.
            setLoading(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      // =====================================
      // PAYMENT FAILED
      // =====================================

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "❌ Razorpay payment failed:",
            response.error
          );

          setStatus(
            "error: Payment failed. Your enquiry is saved. You can retry the payment below."
          );

          // IMPORTANT:
          // Keep enquiryId for retry.
          setLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "❌ Payment error:",
        error
      );

      setStatus(
        `error: ${
          error.message ||
          "Unable to start payment."
        }`
      );

      setLoading(false);
    }
  };

  // =====================================
  // SUBMIT NEW ENQUIRY
  // =====================================
const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);
  setStatus("Sending your enquiry...");

  try {
    const response = await fetch(
      `${API_URL}/api/enquiries`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Unable to submit enquiry."
      );
    }

    const enquiry = Array.isArray(
      result.data
    )
      ? result.data[0]
      : result.data;

    if (!enquiry?.id) {
      throw new Error(
        "Enquiry ID was not returned by server."
      );
    }

    setEnquiryId(enquiry.id);

    setLoading(false);

    const wantsToPay =
      window.confirm(
        "Your enquiry has been submitted successfully.\n\nWould you like to pay the ₹5,000 booking advance now?"
      );

    if (wantsToPay) {
      setStatus(
        "Opening secure payment..."
      );

      await startPayment(
        enquiry.id
      );
    } else {
      setStatus(
        "success: Your enquiry has been submitted successfully. You can make the payment later."
      );

      setFormData({
        ...INITIAL_FORM,
        phone: "7569862230",
      });
    }
  } catch (error) {
    console.error(
      "❌ Enquiry error:",
      error
    );

    setStatus(
      `error: ${
        error.message ||
        "Unable to send enquiry. Please call us."
      }`
    );

    setLoading(false);
  }
};

  // =====================================
  // RETRY PAYMENT
  // =====================================

  const handleRetryPayment = async () => {
    if (!enquiryId || loading) return;

    await startPayment(enquiryId);
  };

  // =====================================
  // STATUS TYPE
  // =====================================

  const getStatusType = () => {
    if (status.startsWith("success:")) {
      return "success";
    }

    if (status.startsWith("error:")) {
      return "error";
    }

    if (status.startsWith("cancelled:")) {
      return "cancelled";
    }

    return "";
  };

  // =====================================
  // STATUS MESSAGE
  // =====================================

  const getStatusMessage = () => {
    return status.replace(
      /^(success:|error:|cancelled:)\s*/,
      ""
    );
  };

  return (
    <section
      className="enquiry-section"
      id="enquiry"
    >
      <div className="enquiry-container">

        {/* =====================================
            HEADING
        ===================================== */}

        <div className="enquiry-heading">

          <p className="section-label">
            START A CONVERSATION
          </p>

          <h2>
            LET&apos;S PLAN
            <br />
            <span>YOUR EVENT.</span>
          </h2>

          <p className="enquiry-description">
            Tell us about your event, and our
            team will create an experience
            that feels completely yours.
          </p>

        </div>

        {/* =====================================
            FORM
        ===================================== */}

        <form
          className="enquiry-form"
          onSubmit={handleSubmit}
        >

          {/* NAME + PHONE */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="name">
                YOUR NAME *
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                disabled={loading}
              />

            </div>

            <div className="form-group">

              <label htmlFor="phone">
                PHONE NUMBER *
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                required
                disabled={loading}
              />

            </div>

          </div>

          {/* EMAIL + EVENT */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="email">
                EMAIL ADDRESS
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                disabled={loading}
              />

            </div>

            <div className="form-group">

              <label htmlFor="event_type">
                EVENT TYPE *
              </label>

              <select
                id="event_type"
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                required
                disabled={loading}
              >

                <option value="">
                  Select your event
                </option>

                <option value="Wedding">
                  Wedding
                </option>

                <option value="Corporate Event">
                  Corporate Event
                </option>

                <option value="Birthday Party">
                  Birthday Party
                </option>

                <option value="Engagement">
                  Engagement
                </option>

                <option value="Concert">
                  Concert
                </option>

                <option value="Private Event">
                  Private Event
                </option>

              </select>

            </div>

          </div>

          {/* DATE + GUESTS */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="event_date">
                EVENT DATE
              </label>

              <input
                id="event_date"
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                disabled={loading}
              />

            </div>

            <div className="form-group">

              <label htmlFor="guests">
                NUMBER OF GUESTS
              </label>

              <input
                id="guests"
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                placeholder="Approx. guests"
                min="1"
                disabled={loading}
              />

            </div>

          </div>

          {/* LOCATION */}

          <div className="form-group full-width">

            <label htmlFor="location">
              EVENT LOCATION
            </label>

            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City / Venue"
              disabled={loading}
            />

          </div>

          {/* MESSAGE */}

          <div className="form-group full-width">

            <label htmlFor="message">
              TELL US ABOUT YOUR EVENT
            </label>

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your event, requirements and vision..."
              rows="5"
              disabled={loading}
            />

          </div>

          {/* =====================================
              PAYMENT INFO
          ===================================== */}

          <div className="payment-info">

            <div className="payment-info-main">

              <span>
                BOOKING ADVANCE
              </span>

              <strong>
                ₹5,000
              </strong>

            </div>

            <p>
              Your enquiry will be saved before
              payment. You will be redirected to
              Razorpay&apos;s secure checkout.
            </p>

          </div>

          {/* =====================================
              BUTTON + DIRECT CALL
          ===================================== */}

          <div className="form-bottom">

            {/* Normal submit button */}
            {!enquiryId && (
              <button
                type="submit"
                className="enquiry-submit"
                disabled={loading}
              >

                <span>
                  {loading
                    ? "PROCESSING..."
                    : "SUBMIT ENQUIRY"}
                </span>

                <span className="submit-arrow">
                  {loading ? "…" : "↗"}
                </span>

              </button>
            )}

            {/* Retry button */}
           {enquiryId && (
  <button
    type="button"
    className="enquiry-submit payment-retry"
    onClick={handleRetryPayment}
    disabled={loading}
  >
    <span>
      {loading
        ? "PROCESSING..."
        : "PAY ₹5,000 ADVANCE"}
    </span>

    <span className="submit-arrow">
      {loading ? "…" : "↗"}
    </span>
  </button>
)}

            <a
              href="tel:7569862230"
              className="direct-call"
            >
              OR SPEAK DIRECTLY

              <span>
                +91 75698 62230
              </span>
            </a>

          </div>

          {/* =====================================
              PAYMENT STATUS
          ===================================== */}

          {status && (
            <div
              className={`form-status ${getStatusType()}`}
              role="status"
              aria-live="polite"
            >

              <span className="status-icon">

                {getStatusType() ===
                  "success"
                  ? "✓"
                  : getStatusType() ===
                    "error"
                  ? "!"
                  : getStatusType() ===
                    "cancelled"
                  ? "↻"
                  : "•"}

              </span>

              <span>
                {getStatusMessage()}
              </span>

            </div>
          )}

        </form>

      </div>
    </section>
  );
}

export default EnquiryForm;