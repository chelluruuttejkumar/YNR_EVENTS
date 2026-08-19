
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/why-ynr.css";

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  {
    number: "01",
    title: "EXPERIENCE",
    description:
      "We understand the rhythm of an event — what needs attention, what can stay invisible and where a single detail can change the entire feeling.",
  },
  {
    number: "02",
    title: "DETAIL",
    description:
      "From the first concept to the final guest touchpoint, every visual, timeline and transition is considered with intention.",
  },
  {
    number: "03",
    title: "EXECUTION",
    description:
      "Our team coordinates the moving parts behind the scenes so the event feels effortless while everything stays on time and on brief.",
  },
  {
    number: "04",
    title: "PERSONAL",
    description:
      "Your celebration should feel like yours. We build around your story, your people and your vision instead of forcing every event into the same template.",
  },
];

function WhyYNR() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector(
        ".why-ynr-header"
      );

      const items = gsap.utils.toArray(
        ".why-ynr-item"
      );

      const isDesktop = window.matchMedia(
        "(pointer: fine) and (min-width: 769px)"
      ).matches;

      if (header) {
        gsap.fromTo(
          header,
          {
            y: 75,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
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
        const number = item.querySelector(
          ".why-ynr-number"
        );

        const title = item.querySelector(
          ".why-ynr-title"
        );

        const description = item.querySelector(
          ".why-ynr-description"
        );

        gsap.fromTo(
          item,
          {
            y: 65,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: index * 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions:
                "play none none reverse",
            },
          }
        );

        if (number) {
          gsap.fromTo(
            number,
            {
              x: -20,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.7,
              delay: index * 0.08 + 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions:
                  "play none none reverse",
              },
            }
          );
        }

        if (title) {
          gsap.fromTo(
            title,
            {
              x: -30,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              delay: index * 0.08 + 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions:
                  "play none none reverse",
              },
            }
          );
        }

        if (description) {
          gsap.fromTo(
            description,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              delay: index * 0.08 + 0.18,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions:
                  "play none none reverse",
              },
            }
          );
        }
      });

      if (isDesktop) {
        items.forEach((item) => {
          const title = item.querySelector(
            ".why-ynr-title"
          );

          const arrow = item.querySelector(
            ".why-ynr-arrow"
          );

          const enter = () => {
            gsap.to(item, {
              x: 8,
              duration: 0.4,
              ease: "power3.out",
              overwrite: "auto",
            });

            if (title) {
              gsap.to(title, {
                x: 10,
                duration: 0.35,
                ease: "power3.out",
                overwrite: "auto",
              });
            }

            if (arrow) {
              gsap.to(arrow, {
                x: 8,
                y: -8,
                duration: 0.4,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
          };

          const leave = () => {
            gsap.to(item, {
              x: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.45)",
            });

            if (title) {
              gsap.to(title, {
                x: 0,
                duration: 0.5,
                ease: "power3.out",
              });
            }

            if (arrow) {
              gsap.to(arrow, {
                x: 0,
                y: 0,
                duration: 0.55,
                ease: "elastic.out(1, 0.45)",
              });
            }
          };

          item.addEventListener(
            "mouseenter",
            enter
          );

          item.addEventListener(
            "mouseleave",
            leave
          );

          item._whyHandlers = {
            enter,
            leave,
          };
        });
      }

      return () => {
        items.forEach((item) => {
          const handlers = item._whyHandlers;

          if (!handlers) return;

          item.removeEventListener(
            "mouseenter",
            handlers.enter
          );

          item.removeEventListener(
            "mouseleave",
            handlers.leave
          );
        });
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="why-ynr-section"
      id="why-ynr"
      ref={sectionRef}
    >
      <div className="why-ynr-container">

        <div className="why-ynr-header">
          <div>
            <p className="section-label">
              THE YNR DIFFERENCE
            </p>

            <h2>
              WHY
              <br />
              <em>YNR EVENTS.</em>
            </h2>
          </div>

          <p className="why-ynr-intro">
            Great events don't happen by accident.
            They happen when creativity, planning
            and execution move together.
          </p>
        </div>

        <div className="why-ynr-list">
          {REASONS.map((item) => (
            <article
              className="why-ynr-item"
              key={item.number}
            >
              <span className="why-ynr-number">
                {item.number}
              </span>

              <h3 className="why-ynr-title">
                {item.title}
              </h3>

              <p className="why-ynr-description">
                {item.description}
              </p>

              <span className="why-ynr-arrow">
                ↗
              </span>
            </article>
          ))}
        </div>

        <div className="why-ynr-footer">
          <p>
            LET&apos;S MAKE SOMETHING
            WORTH REMEMBERING.
          </p>

          <a
            href="#enquiry"
            className="why-ynr-cta"
          >
            <span>Start a conversation</span>
            <span>↗</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default WhyYNR;

