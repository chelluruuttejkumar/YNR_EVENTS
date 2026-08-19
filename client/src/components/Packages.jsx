
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/packages.css";

gsap.registerPlugin(ScrollTrigger);

const PACKAGES = [
  {
    number: "01",
    name: "ESSENTIAL",
    subtitle: "INTIMATE & PERSONAL",
    description:
      "A thoughtful planning experience for intimate celebrations that deserve beautiful details without unnecessary complexity.",
    features: [
      "Event planning consultation",
      "Concept & mood direction",
      "Timeline coordination",
      "Day-of support",
    ],
  },
  {
    number: "02",
    name: "SIGNATURE",
    subtitle: "OUR MOST REQUESTED",
    featured: true,
    description:
      "A complete planning experience designed for couples, families and brands who want every detail thoughtfully handled.",
    features: [
      "Full event planning",
      "Creative concept & styling",
      "Vendor coordination",
      "Guest experience planning",
      "Event-day execution",
    ],
  },
  {
    number: "03",
    name: "LUXURY",
    subtitle: "FULL-SERVICE EXPERIENCE",
    description:
      "For ambitious celebrations where design, production, hospitality and execution need to work together flawlessly.",
    features: [
      "End-to-end event management",
      "Luxury styling & production",
      "Premium vendor management",
      "Detailed guest journey",
      "Dedicated event coordination",
    ],
  },
  {
    number: "04",
    name: "CUSTOM",
    subtitle: "BUILT AROUND YOU",
    description:
      "No two events are the same. We create a completely tailored plan around your vision, scale, location and requirements.",
    features: [
      "Custom event strategy",
      "Flexible planning scope",
      "Special production needs",
      "Personalized creative direction",
      "Dedicated consultation",
    ],
  },
];

function Packages() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector(
        ".packages-header"
      );

      const cards = gsap.utils.toArray(
        ".package-card"
      );

      if (header) {
        gsap.fromTo(
          header,
          {
            y: 80,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
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

      cards.forEach((card, index) => {
        const content = card.querySelector(
          ".package-card-inner"
        );

        gsap.fromTo(
          card,
          {
            y: 90,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: index * 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions:
                "play none none reverse",
            },
          }
        );

        if (content) {
          gsap.fromTo(
            content,
            {
              y: 30,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              delay: index * 0.08 + 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 84%",
                toggleActions:
                  "play none none reverse",
              },
            }
          );
        }
      });

      const isDesktop =
        window.matchMedia(
          "(pointer: fine) and (min-width: 769px)"
        ).matches;

      if (isDesktop) {
        cards.forEach((card) => {
          const move = (event) => {
            const rect =
              card.getBoundingClientRect();

            const x =
              (event.clientX - rect.left) /
                rect.width -
              0.5;

            const y =
              (event.clientY - rect.top) /
                rect.height -
              0.5;

            gsap.to(card, {
              x: x * 5,
              y: y * 5,
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          const enter = () => {
            gsap.to(card, {
              y: -8,
              duration: 0.4,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          const leave = () => {
            gsap.to(card, {
              x: 0,
              y: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.45)",
            });
          };

          card.addEventListener(
            "mousemove",
            move
          );
          card.addEventListener(
            "mouseenter",
            enter
          );
          card.addEventListener(
            "mouseleave",
            leave
          );

          card._packageHandlers = {
            move,
            enter,
            leave,
          };
        });
      }

      return () => {
        cards.forEach((card) => {
          const handlers =
            card._packageHandlers;

          if (!handlers) return;

          card.removeEventListener(
            "mousemove",
            handlers.move
          );

          card.removeEventListener(
            "mouseenter",
            handlers.enter
          );

          card.removeEventListener(
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
      className="packages-section"
      id="packages"
      ref={sectionRef}
    >
      <div className="packages-container">

        <div className="packages-header">
          <div>
            <p className="section-label">
              CURATED EXPERIENCES
            </p>

            <h2>
              FIND YOUR
              <br />
              <em>PERFECT FIT.</em>
            </h2>
          </div>

          <p className="packages-intro">
            Every event has a different scale,
            story and rhythm. Choose a starting
            point and we&apos;ll shape the experience
            around you.
          </p>
        </div>

        <div className="packages-grid">
          {PACKAGES.map((item) => (
            <article
              className={`package-card ${
                item.featured
                  ? "package-card-featured"
                  : ""
              }`}
              key={item.number}
            >
              {item.featured && (
                <span className="package-featured-label">
                  MOST REQUESTED
                </span>
              )}

              <div className="package-card-inner">

                <div className="package-top">
                  <span className="package-number">
                    {item.number}
                  </span>

                  <span className="package-subtitle">
                    {item.subtitle}
                  </span>
                </div>

                <h3>{item.name}</h3>

                <p className="package-description">
                  {item.description}
                </p>

                <div className="package-features">
                  {item.features.map(
                    (feature) => (
                      <div
                        className="package-feature"
                        key={feature}
                      >
                        <span>+</span>
                        <span>
                          {feature}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <a
                  href="#enquiry"
                  className="package-cta"
                >
                  <span>Enquire now</span>
                  <span>↗</span>
                </a>

              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Packages;

