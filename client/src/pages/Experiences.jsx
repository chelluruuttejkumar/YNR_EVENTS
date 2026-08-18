import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/experiences.css";

// =====================================
// EXPERIENCE DATA
// =====================================

const EXPERIENCES = [
  {
    index: "01",
    title: "Weddings",
    tagline: "TWO STORIES, ONE NIGHT",
    description:
      "From the first walk down the aisle to the last dance under the lights, we shape every hour so it feels like it was always meant to happen this way.",
    glyph:
      "M30 16 C22 16 16 22 16 30 C16 38 22 44 30 44 M30 16 C38 16 44 22 44 30 C44 38 38 44 30 44",
  },
  {
    index: "02",
    title: "Corporate Events",
    tagline: "WORK, WORTH SHOWING UP FOR",
    description:
      "Product launches, milestone dinners, offsites that people actually talk about after. We handle the run-of-show so your team can be in the room, not behind it.",
    glyph: "M12 46 L26 32 L34 38 L48 14 M40 14 L48 14 L48 22",
  },
  {
    index: "03",
    title: "Birthday Parties",
    tagline: "A YEAR, MARKED PROPERLY",
    description:
      "Whether it's a first birthday or a fiftieth, we build the kind of room that makes people forget to check their phones.",
    glyph:
      "M30 44 L30 24 M22 44 L38 44 M30 24 C27 20 27 16 30 12 C33 16 33 20 30 24",
  },
  {
    index: "04",
    title: "Engagements",
    tagline: "THE MOMENT BEFORE THE MOMENT",
    description:
      "One question, one answer, one setting that gets it right the first time. We build the backdrop so the only thing anyone remembers is each other.",
    glyph:
      "M30 46 C21 46 14 39 14 30 C14 21 21 14 30 14 C39 14 46 21 46 30 C46 36 43 41 38 44 M30 14 L26 6 L34 6 Z",
  },
  {
    index: "05",
    title: "Concerts",
    tagline: "SOUND, BUILT TO TRAVEL",
    description:
      "Staging, sound, and crowd flow for rooms that need to hold energy, not just people. Built for the acts and the audience in equal measure.",
    glyph:
      "M10 30 L10 30 M16 20 L16 40 M24 12 L24 48 M32 22 L32 38 M40 16 L40 44 M48 26 L48 34",
  },
  {
    index: "06",
    title: "Private Events",
    tagline: "FOR THE GUEST LIST OF ONE",
    description:
      "Anniversaries, homecomings, quiet celebrations with no name for the occasion. Just a night that's exactly and only yours.",
    glyph: "M30 8 L34 26 L52 30 L34 34 L30 52 L26 34 L8 30 L26 26 Z",
  },
];

// =====================================
// ANIMATED GLYPH
// =====================================

function Glyph({ d, active }) {
  return (
    <svg
      className={`exp-glyph ${active ? "is-drawn" : ""}`}
      viewBox="0 0 60 60"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

// =====================================
// EXPERIENCE PANEL
// =====================================

function ExperiencePanel({ item, position, onVisible }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          onVisible(item.index);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [item.index, onVisible]);

  return (
    <article
      ref={ref}
      className={`exp-panel exp-panel--${position} ${
        visible ? "is-visible" : ""
      }`}
      id={`experience-${item.index}`}
    >
      <div className="exp-panel-visual">
        <Glyph d={item.glyph} active={visible} />
      </div>

      <div className="exp-panel-copy">
        <span className="exp-panel-index">{item.index}</span>

        <p className="exp-panel-tagline">{item.tagline}</p>

        <h2 className="exp-panel-title">{item.title}</h2>

        <p className="exp-panel-description">{item.description}</p>

        <Link to="/#enquiry" className="exp-panel-cta">
          <span>Start planning</span>
          <span className="exp-panel-cta-arrow">↗</span>
        </Link>
      </div>
    </article>
  );
}

// =====================================
// PAGE
// =====================================

function Experiences() {
  const [activeIndex, setActiveIndex] = useState("01");

  return (
    <div className="experiences-page">
      {/* =====================================
          SIDE RAIL
      ===================================== */}

      <nav className="exp-rail" aria-label="Experience sections">
        {EXPERIENCES.map((item) => (
          <a
            key={item.index}
            href={`#experience-${item.index}`}
            className={`exp-rail-item ${
              activeIndex === item.index ? "is-active" : ""
            }`}
          >
            <span className="exp-rail-dot" />
            <span className="exp-rail-label">{item.title}</span>
          </a>
        ))}
      </nav>

      {/* =====================================
          HERO
      ===================================== */}

      <header className="exp-hero">
        <Link to="/" className="exp-hero-back">
          ← YNR EVENTS
        </Link>

        <p className="exp-hero-eyebrow">THE YNR EXPERIENCE</p>

        <h1 className="exp-hero-title">
          <span>EVERY EVENT</span>
          <span>HAS A SHAPE.</span>
        </h1>

        <p className="exp-hero-subtitle">
          Six ways we've learned to build a night people remember.
          Scroll to see how each one takes form.
        </p>

        <a href="#experience-01" className="exp-hero-scroll">
          <span className="exp-hero-scroll-line" />
          SCROLL
        </a>
      </header>

      {/* =====================================
          EXPERIENCE PANELS
      ===================================== */}

      <main className="exp-panels">
        {EXPERIENCES.map((item, i) => (
          <ExperiencePanel
            key={item.index}
            item={item}
            position={i % 2 === 0 ? "left" : "right"}
            onVisible={setActiveIndex}
          />
        ))}
      </main>

      {/* =====================================
          CLOSING CTA
      ===================================== */}

      <footer className="exp-closing">
        <p className="exp-closing-eyebrow">READY WHEN YOU ARE</p>

        <h2 className="exp-closing-title">
          Let&apos;s build yours.
        </h2>

        <Link to="/#enquiry" className="exp-closing-cta">
          <span>Start a conversation</span>
          <span className="exp-panel-cta-arrow">↗</span>
        </Link>
      </footer>
    </div>
  );
}

export default Experiences;