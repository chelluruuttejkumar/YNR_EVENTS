import { useState } from "react";
import "../styles/enquiry.css";

function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "7569862230",
    email: "",
    event_type: "",
    event_date: "",
    guests: "",
    location: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("http://localhost:5000/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("Enquiry sent successfully!");

      setFormData({
        name: "",
        phone: "7569862230",
        email: "",
        event_type: "",
        event_date: "",
        guests: "",
        location: "",
        message: "",
      });
    } catch (error) {
      console.error("Enquiry error:", error);
      setStatus("Unable to send enquiry. Please call us.");
    }
  };

  return (
    <section className="enquiry-section" id="enquiry">
      <div className="enquiry-container">

        <div className="enquiry-heading">
          <p className="section-label">START A CONVERSATION</p>

          <h2>
            LET&apos;S PLAN
            <br />
            <span>YOUR EVENT.</span>
          </h2>

          <p className="enquiry-description">
            Tell us about your event, and our team will create an
            experience that feels completely yours.
          </p>
        </div>

        <form className="enquiry-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">YOUR NAME *</label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">PHONE NUMBER *</label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">EMAIL ADDRESS</label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="event_type">EVENT TYPE *</label>

              <select
                id="event_type"
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                required
              >
                <option value="">Select your event</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate Event">
                  Corporate Event
                </option>
                <option value="Birthday Party">
                  Birthday Party
                </option>
                <option value="Engagement">Engagement</option>
                <option value="Concert">Concert</option>
                <option value="Private Event">
                  Private Event
                </option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event_date">EVENT DATE</label>

              <input
                id="event_date"
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="guests">NUMBER OF GUESTS</label>

              <input
                id="guests"
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                placeholder="Approx. guests"
                min="1"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="location">EVENT LOCATION</label>

            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City / Venue"
            />
          </div>

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
            />
          </div>

          <div className="form-bottom">
            <button
              type="submit"
              className="enquiry-submit"
            >
              <span>SEND ENQUIRY</span>
              <span className="submit-arrow">↗</span>
            </button>

            <a
              href="tel:7569862230"
              className="direct-call"
            >
              OR SPEAK DIRECTLY
              <span>+91 75698 62230</span>
            </a>
          </div>

          {status && (
            <p className="form-status">
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default EnquiryForm;