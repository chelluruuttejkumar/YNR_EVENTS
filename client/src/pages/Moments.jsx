import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/moments.css";

// =====================================
// TESTIMONIAL DATA
// Replace with real client quotes.
// =====================================

const TICKER_LINES = [
  "Every detail, remembered.",
  "They read the room before we did.",
  "Nothing felt rehearsed.",
  "The calmest chaos we've seen.",
  "Guests are still talking about it.",
  "Exactly what we asked for, and more.",
];

const TESTIMONIALS = [
  {
    quote:
      "We stopped worrying about the schedule the moment the team walked in. Every handoff, every cue, just happened.",
    name: "Ananya & Rohit",
    event: "Wedding, Hyderabad",
  },
  {
    quote:
      "Our product launch needed to feel like a statement, not a slideshow. They understood that brief in one call.",
    name: "Karthik Menon",
    event: "Corporate Event, Bengaluru",
  },
  {
    quote:
      "My daughter's first birthday had exactly the chaos a one-year-old's party needs, and none of the chaos we feared.",
    name: "Priya Reddy",
    event: "Birthday Party, Chennai",
  },
  {
    quote:
      "We wanted the proposal to feel private even with forty people watching from a distance. They pulled it off.",
    name: "Farah & Aditya",
    event: "Engagement, Goa",
  },
  {
    quote:
      "Sound and stage were ready an hour early. For a touring act, that almost never happens.",
    name: "The Wanderlight Collective",
    event: "Concert, Mumbai",
  },
  {
    quote:
      "It wasn't a big event. That was the point, and they respected it completely.",
    name: "Vikram Rao",
    event: "Private Event, Pune",
  },
];

// =====================================
// TESTIMONIAL CARD
// =====================================

function TestimonialCard({ item }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className={`moment-card ${visible ? "is-visible" : ""}`}
    >
      <span className="moment-card-mark">“</span>

      <blockquote className="moment-card-quote">
        {item.quote}
      </blockquote>

      <figcaption className="moment-card-author">
        <span className="moment-card-name">{item.name}</span>
        <span className="moment-card-event">{item.event}</span>
      </figcaption>
    </figure>
  );
}

// =====================================
// PAGE
// =====================================

function Moments() {
  return (
    <div className="moments-page">
      {/* =====================================
          HERO
      ===================================== */}

      <header className="moment-hero">
        <Link to="/" className="moment-hero-back">
          ← YNR EVENTS
        </Link>

        <p className="moment-hero-eyebrow">IN THEIR WORDS</p>

        <h1 className="moment-hero-title">
          <span>MOMENTS,</span>
          <span>AS THEY FELT THEM.</span>
        </h1>

        <p className="moment-hero-subtitle">
          Not our highlight reel. Theirs.
        </p>
      </header>

      {/* =====================================
          SCROLLING TICKER
      ===================================== */}

      <div className="moment-ticker" aria-hidden="true">
        <div className="moment-ticker-track">
          {[...TICKER_LINES, ...TICKER_LINES].map((line, i) => (
            <span className="moment-ticker-item" key={i}>
              {line}
              <span className="moment-ticker-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* =====================================
          TESTIMONIAL GRID
      ===================================== */}

      <main className="moment-grid">
        {TESTIMONIALS.map((item, i) => (
          <TestimonialCard item={item} key={i} />
        ))}
      </main>

      {/* =====================================
          CLOSING CTA
      ===================================== */}

      <footer className="moment-closing">
        <p className="moment-closing-eyebrow">YOUR TURN</p>

        <h2 className="moment-closing-title">Be the next story.</h2>

        <Link to="/#enquiry" className="moment-closing-cta">
          <span>Start a conversation</span>
          <span className="moment-closing-arrow">↗</span>
        </Link>
      </footer>
    </div>
  );
}

export default Moments;