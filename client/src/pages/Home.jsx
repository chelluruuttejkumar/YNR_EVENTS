import AnimatedHero from "../components/AnimatedHero";
import EventGallery from "../components/EventGallery";
import EnquiryForm from "../components/EnquiryForm";

const events = [
  "Weddings",
  "Corporate Events",
  "Birthday Parties",
  "Engagements",
  "Concerts",
  "Private Events",
];

function Home() {
  return (
    <>
      <AnimatedHero />

      <main>
        <section className="intro-section" id="about">
          <div className="section-inner reveal-section">
            <p className="section-label">
              YNR EVENTS
            </p>

            <h2>
              YOUR VISION.
              <br />
              <span>OUR CREATION.</span>
            </h2>

            <p className="intro-text">
              We plan and create memorable experiences
              that turn special occasions into
              unforgettable moments.
            </p>
          </div>
        </section>

        <section
          className="events-section"
          id="events"
        >
          <div className="section-inner">
            <p className="section-label">
              WHAT WE CREATE
            </p>

            <h2 className="events-heading">
              EVENTS
            </h2>

            <div className="event-grid">
              {events.map((event, index) => (
                <a
                  href="#enquiry"
                  className="event-card"
                  key={event}
                >
                  <span className="event-number">
                    0{index + 1}
                  </span>

                  <span className="event-name">
                    {event}
                  </span>

                  <span className="arrow">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <EventGallery />

        <section id="enquiry">
          <EnquiryForm />
        </section>

        <section
          className="booking-section"
          id="booking"
        >
          <div className="section-inner">
            <p className="section-label">
              LET'S CREATE
            </p>

            <h2>
              YOUR NEXT
              <br />
              <span>BIG MOMENT.</span>
            </h2>

            <a
              href="tel:7569862230"
              className="primary-button"
            >
              Call +91 75698 62230
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;