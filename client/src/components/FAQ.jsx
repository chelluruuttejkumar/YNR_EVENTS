
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/faq.css";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    question: "What types of events do you manage?",
    answer:
      "We manage weddings, corporate events, birthday celebrations, engagements, concerts and private events. Every event is shaped around the client's vision, scale and requirements.",
  },
  {
    question: "How early should we contact YNR Events?",
    answer:
      "The earlier you contact us, the more flexibility we have with planning, vendors and production. We also work with shorter timelines depending on the event and availability.",
  },
  {
    question: "Can you create a completely custom event?",
    answer:
      "Absolutely. Our planning approach is flexible, so the concept, styling, production and guest experience can all be tailored to your event.",
  },
  {
    question: "Do you handle vendors and coordination?",
    answer:
      "Yes. Depending on the scope of your event, we can coordinate vendors, timelines, production, logistics and event-day execution.",
  },
  {
    question: "Can you manage events outside our city?",
    answer:
      "Yes. Location and travel requirements can be discussed during the planning stage and included in the event proposal.",
  },
  {
    question: "How do I start planning my event?",
    answer:
      "Start by filling out the enquiry form with your event details. Our team can then understand your requirements and discuss the next steps with you.",
  },
];

function FAQ() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector(
        ".faq-header"
      );

      const items = gsap.utils.toArray(
        ".faq-item"
      );

      if (header) {
        gsap.fromTo(
          header,
          {
            y: 70,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: header,
              start: "top 84%",
              toggleActions:
                "play none none reverse",
            },
          }
        );
      }

      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            y: 45,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions:
                "play none none reverse",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex((current) =>
      current === index ? null : index
    );
  };

  return (
    <section
      className="faq-section"
      id="faq"
      ref={sectionRef}
    >
      <div className="faq-container">

        <div className="faq-header">
          <div>
            <p className="section-label">
              QUESTIONS, ANSWERED
            </p>

            <h2>
              GOOD TO
              <br />
              <em>KNOW.</em>
            </h2>
          </div>

          <p className="faq-intro">
            A few things clients usually want to
            know before bringing us into the room.
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((item, index) => {
            const isActive =
              activeIndex === index;

            return (
              <article
                className={`faq-item ${
                  isActive ? "is-open" : ""
                }`}
                key={item.question}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() =>
                    toggleFAQ(index)
                  }
                  aria-expanded={isActive}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq-number">
                    0{index + 1}
                  </span>

                  <span className="faq-question-text">
                    {item.question}
                  </span>

                  <span
                    className="faq-icon"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className="faq-answer-wrap"
                  style={{
                    gridTemplateRows: isActive
                      ? "1fr"
                      : "0fr",
                  }}
                >
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="faq-footer">
          <p>
            STILL HAVE A QUESTION?
          </p>

          <a
            href="#enquiry"
            className="faq-cta"
          >
            <span>Talk to YNR Events</span>
            <span>↗</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default FAQ;

