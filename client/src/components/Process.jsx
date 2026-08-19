
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/process.css";

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    number: "01",
    title: "DISCOVER",
    short: "Your vision, first.",
    description:
      "We start by understanding your event, your people, your priorities and the feeling you want everyone to leave with.",
  },
  {
    number: "02",
    title: "PLAN",
    short: "Every detail, mapped.",
    description:
      "We shape the concept, timeline, vendors, logistics and guest experience into one clear plan.",
  },
  {
    number: "03",
    title: "DESIGN",
    short: "Make it feel yours.",
    description:
      "From atmosphere and styling to layouts and production, we turn the plan into a visual experience.",
  },
  {
    number: "04",
    title: "EXECUTE",
    short: "We take the lead.",
    description:
      "Our team coordinates the moving parts, manages the schedule and keeps the experience flowing on the day.",
  },
  {
    number: "05",
    title: "CELEBRATE",
    short: "You enjoy the moment.",
    description:
      "You get to be present with your people while we handle the details happening behind the scenes.",
  },
];

function Process() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const header =
        section.querySelector(".process-header");

      const steps = gsap.utils.toArray(
        ".process-step"
      );

      const line =
        section.querySelector(".process-line-progress");

      const isDesktop = window.matchMedia(
        "(min-width: 901px)"
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
            duration: 1.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: header,
              start: "top 82%",
              toggleActions:
                "play none none reverse",
            },
          }
        );
      }

      steps.forEach((step, index) => {
        const number = step.querySelector(
          ".process-step-number"
        );

        const title = step.querySelector(
          ".process-step-title"
        );

        const copy = step.querySelector(
          ".process-step-copy"
        );

        gsap.fromTo(
          step,
          {
            y: 70,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: index * 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: step,
              start: "top 84%",
              toggleActions:
                "play none none reverse",
            },
          }
        );

        if (number) {
          gsap.fromTo(
            number,
            {
              scale: 0.7,
              opacity: 0.2,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.75,
              delay: index * 0.08,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: step,
                start: "top 84%",
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
              x: -25,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.7,
              delay: index * 0.08 + 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: step,
                start: "top 84%",
                toggleActions:
                  "play none none reverse",
              },
            }
          );
        }

        if (copy) {
          gsap.fromTo(
            copy,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: index * 0.08 + 0.16,
              ease: "power3.out",
              scrollTrigger: {
                trigger: step,
                start: "top 84%",
                toggleActions:
                  "play none none reverse",
              },
            }
          );
        }
      });

      if (line && isDesktop) {
        gsap.to(line, {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "bottom 70%",
            scrub: 1,
          },
        });
      }

      if (line && !isDesktop) {
        gsap.to(line, {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 75%",
            scrub: 1,
          },
        });
      }

      if (isDesktop) {
        steps.forEach((step) => {
          const title = step.querySelector(
            ".process-step-title"
          );

          const arrow = step.querySelector(
            ".process-step-arrow"
          );

          const enter = () => {
            gsap.to(step, {
              y: -8,
              duration: 0.4,
              ease: "power3.out",
              overwrite: "auto",
            });

            if (title) {
              gsap.to(title, {
                x: 10,
                duration: 0.35,
                ease: "power3.out",
              });
            }

            if (arrow) {
              gsap.to(arrow, {
                x: 8,
                y: -8,
                duration: 0.35,
                ease: "power3.out",
              });
            }
          };

          const leave = () => {
            gsap.to(step, {
              y: 0,
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

          step.addEventListener(
            "mouseenter",
            enter
          );

          step.addEventListener(
            "mouseleave",
            leave
          );

          step._processHandlers = {
            enter,
            leave,
          };
        });
      }

      return () => {
        steps.forEach((step) => {
          const handlers =
            step._processHandlers;

          if (!handlers) return;

          step.removeEventListener(
            "mouseenter",
            handlers.enter
          );

          step.removeEventListener(
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
      className="process-section"
      id="process"
      ref={sectionRef}
    >
      <div className="process-container">

        <div className="process-header">
          <div>
            <p className="section-label">
              HOW WE WORK
            </p>

            <h2>
              FROM IDEA
              <br />
              <em>TO MOMENT.</em>
            </h2>
          </div>

          <p className="process-intro">
            A clear process keeps creativity moving
            without losing the details that make an
            event feel effortless.
          </p>
        </div>

        <div className="process-timeline">
          <div className="process-line">
            <span className="process-line-progress" />
          </div>

          <div className="process-steps">
            {PROCESS_STEPS.map((step) => (
              <article
                className="process-step"
                key={step.number}
              >
                <span className="process-step-number">
                  {step.number}
                </span>

                <div className="process-step-main">
                  <p className="process-step-kicker">
                    {step.short}
                  </p>

                  <h3 className="process-step-title">
                    {step.title}
                  </h3>

                  <p className="process-step-copy">
                    {step.description}
                  </p>
                </div>

                <span className="process-step-arrow">
                  ↗
                </span>
              </article>
            ))}
          </div>
        </div>

        <div className="process-footer">
          <p>
            READY TO START?
          </p>

          <a
            href="#enquiry"
            className="process-cta"
          >
            <span>Start a conversation</span>
            <span>↗</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default Process;

