
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AnimatedHero from "../components/AnimatedHero";
import EventGallery from "../components/EventGallery";
import EnquiryForm from "../components/EnquiryForm";

gsap.registerPlugin(ScrollTrigger);

const events = [
  "Weddings",
  "Corporate Events",
  "Birthday Parties",
  "Engagements",
  "Concerts",
  "Private Events",
];

function Home() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".premium-reveal-section");

      sections.forEach((section) => {
        const elements = section.querySelectorAll(
          ".section-label, .premium-title, .intro-text, .events-description, .event-card, .premium-copy, .premium-button"
        );

        if (!elements.length) return;

        gsap.fromTo(
          elements,
          {
            y: 70,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      /* =========================================
         INTRO CINEMATIC PARALLAX
      ========================================= */

      const introTitle = document.querySelector(
        ".intro-section .premium-title"
      );

      if (introTitle) {
        gsap.fromTo(
          introTitle,
          {
            yPercent: 12,
          },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: ".intro-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      /* =========================================
         EVENT CARD CINEMATIC MOVEMENT
      ========================================= */

      const eventCards = gsap.utils.toArray(".event-card");

      eventCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            y: 80,
            opacity: 0,
            rotateX: 8,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            delay: index * 0.06,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );

        const number = card.querySelector(".event-number");
        const arrow = card.querySelector(".arrow");

        if (number) {
          gsap.to(number, {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        if (arrow) {
          gsap.to(arrow, {
            rotation: 45,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });

      /* =========================================
         EVENTS HEADING PARALLAX
      ========================================= */

      const eventsHeading =
        document.querySelector(".events-heading");

      if (eventsHeading) {
        gsap.fromTo(
          eventsHeading,
          {
            xPercent: -4,
          },
          {
            xPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: ".events-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }

      /* =========================================
         ENQUIRY SECTION REVEAL
      ========================================= */

      const enquiry = document.querySelector(
        ".enquiry-section"
      );

      if (enquiry) {
        const heading = enquiry.querySelector(
          ".enquiry-heading"
        );

        const form = enquiry.querySelector(
          ".enquiry-form"
        );

        if (heading) {
          gsap.fromTo(
            heading,
            {
              y: 90,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: enquiry,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (form) {
          gsap.fromTo(
            form,
            {
              y: 60,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              delay: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: enquiry,
                start: "top 65%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      /* =========================================
         BOOKING FINAL REVEAL
      ========================================= */

      const booking = document.querySelector(
        ".booking-section"
      );

      if (booking) {
        const title = booking.querySelector("h2");
        const button = booking.querySelector(
          ".primary-button"
        );

        gsap.fromTo(
          title,
          {
            y: 100,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: booking,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        if (button) {
          gsap.fromTo(
            button,
            {
              y: 40,
              opacity: 0,
              scale: 0.96,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              delay: 0.25,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: booking,
                start: "top 65%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      /* =========================================
         MAGNETIC PRIMARY BUTTON
      ========================================= */

      const primaryButtons =
        gsap.utils.toArray(".primary-button");

      primaryButtons.forEach((button) => {
        const moveButton = (event) => {
          const rect = button.getBoundingClientRect();

          const x =
            (event.clientX - rect.left - rect.width / 2) *
            0.15;

          const y =
            (event.clientY - rect.top - rect.height / 2) *
            0.15;

          gsap.to(button, {
            x,
            y,
            duration: 0.35,
            ease: "power3.out",
          });
        };

        const resetButton = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
          });
        };

        button.addEventListener(
          "mousemove",
          moveButton
        );

        button.addEventListener(
          "mouseleave",
          resetButton
        );

        button._moveButton = moveButton;
        button._resetButton = resetButton;
      });

      /* =========================================
         REDUCED MOTION
      ========================================= */

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reducedMotion) {
        ScrollTrigger.getAll().forEach((trigger) =>
          trigger.disable()
        );

        gsap.set(
          ".premium-reveal-section *",
          {
            clearProps: "all",
          }
        );
      }

      /* =========================================
         CLEANUP
      ========================================= */

      return () => {
        primaryButtons.forEach((button) => {
          if (button._moveButton) {
            button.removeEventListener(
              "mousemove",
              button._moveButton
            );
          }

          if (button._resetButton) {
            button.removeEventListener(
              "mouseleave",
              button._resetButton
            );
          }
        });
      };
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="ynr-page">
      <AnimatedHero />

      <main>
        {/* =========================================
            INTRO
        ========================================= */}

        <section
          className="intro-section premium-reveal-section"
          id="about"
        >
          <div className="section-inner">
            <p className="section-label">
              YNR EVENTS
            </p>

            <h2 className="premium-title">
              YOUR VISION.
              <br />
              <span>OUR CREATION.</span>
            </h2>

            <p className="intro-text premium-copy">
              We plan and create memorable experiences
              that turn special occasions into
              unforgettable moments.
            </p>
          </div>
        </section>

        {/* =========================================
            EVENTS
        ========================================= */}

        <section
          className="events-section premium-reveal-section"
          id="events"
        >
          <div className="section-inner">
            <p className="section-label">
              WHAT WE CREATE
            </p>

            <div className="events-heading">
              <h2 className="premium-title">
                EVENTS
              </h2>
            </div>

            <div className="event-grid">
              {events.map((event, index) => (
                <a
                  href="#enquiry"
                  className="event-card"
                  key={event}
                >
                  <span className="event-number">
                    {String(index + 1).padStart(2, "0")}
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

        {/* =========================================
            GALLERY
        ========================================= */}

        <EventGallery />

        {/* =========================================
            ENQUIRY
        ========================================= */}

        <section id="enquiry">
          <EnquiryForm />
        </section>

        {/* =========================================
            FINAL CTA
        ========================================= */}

        <section
          className="booking-section premium-reveal-section"
          id="booking"
        >
          <div className="section-inner">
            <p className="section-label">
              LET&apos;S CREATE
            </p>

            <h2 className="premium-title">
              YOUR NEXT
              <br />
              <span>BIG MOMENT.</span>
            </h2>

            <p className="booking-text premium-copy">
              From intimate celebrations to
              unforgettable grand occasions, YNR Events
              brings your vision to life.
            </p>

            <a
              href="tel:7569862230"
              className="primary-button premium-button"
            >
              Call +91 75698 62230
              <span>↗</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;

