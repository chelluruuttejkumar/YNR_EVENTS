import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=90",
    title: "Weddings",
    number: "01",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=90",
    title: "Celebrations",
    number: "02",
  },
  {
    src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1800&q=90",
    title: "Corporate",
    number: "03",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=90",
    title: "Private Events",
    number: "04",
  },
];

function EventGallery() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".premium-gallery-card");
      const isDesktop = window.matchMedia(
        "(pointer: fine) and (min-width: 769px)"
      ).matches;

      /* =====================================================
         HEADER REVEAL
      ===================================================== */

      const header = section.querySelector(".premium-gallery-header");

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
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: header,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* =====================================================
         HEADING PARALLAX
      ===================================================== */

      const heading = section.querySelector(
        ".premium-gallery-heading"
      );

      if (heading) {
        gsap.to(heading, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      /* =====================================================
         CARD ANIMATIONS
      ===================================================== */

      cards.forEach((card, index) => {
        const image = card.querySelector(
          ".premium-gallery-image"
        );

        const content = card.querySelector(
          ".gallery-card-content"
        );

        const number = card.querySelector(
          ".gallery-number"
        );

        const title = card.querySelector(
          ".gallery-card-title"
        );

        const arrow = card.querySelector(
          ".gallery-arrow"
        );

        if (!image || !content) return;

        /* Initial state */

        gsap.set(card, {
          y: 100,
          opacity: 0,
        });

        gsap.set(image, {
          scale: 1.16,
          x: 0,
          y: 0,
        });

        gsap.set(content, {
          y: 35,
          opacity: 0,
          x: 0,
        });

        if (number) {
          gsap.set(number, {
            x: -20,
            opacity: 0,
          });
        }

        /* =================================================
           REVEAL TIMELINE
        ================================================= */

        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        reveal
          .to(card, {
            y: 0,
            opacity: 1,
            duration: 1.05,
            delay: index * 0.08,
            ease: "power4.out",
          })
          .to(
            image,
            {
              scale: 1,
              duration: 1.6,
              ease: "power3.out",
            },
            "-=0.8"
          )
          .to(
            content,
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
            },
            "-=1"
          );

        /* =================================================
           NUMBER REVEAL
        ================================================= */

        if (number) {
          gsap.to(number, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.08 + 0.25,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          });
        }

        /* =================================================
           IMAGE PARALLAX
        ================================================= */

        gsap.to(image, {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.3,
          },
        });

        /* =================================================
           DESKTOP INTERACTION
        ================================================= */

        if (isDesktop) {
          const handleMouseMove = (event) => {
            const rect = card.getBoundingClientRect();

            const mouseX =
              (event.clientX - rect.left) /
                rect.width -
              0.5;

            const mouseY =
              (event.clientY - rect.top) /
                rect.height -
              0.5;

            gsap.to(image, {
              x: mouseX * 18,
              y: mouseY * 10,
              scale: 1.07,
              duration: 0.7,
              ease: "power3.out",
              overwrite: "auto",
            });

            gsap.to(content, {
              x: mouseX * 8,
              y: mouseY * 5,
              duration: 0.7,
              ease: "power3.out",
              overwrite: "auto",
            });

            if (arrow) {
              gsap.to(arrow, {
                x: mouseX * 10,
                y: mouseY * 10,
                duration: 0.6,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
          };

          const handleMouseEnter = () => {
            gsap.to(card, {
              y: -6,
              duration: 0.5,
              ease: "power3.out",
              overwrite: "auto",
            });

            gsap.to(image, {
              scale: 1.07,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto",
            });

            gsap.to(content, {
              y: -2,
              duration: 0.5,
              ease: "power3.out",
              overwrite: "auto",
            });

            if (title) {
              gsap.to(title, {
                x: 10,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
              });
            }

            if (arrow) {
              gsap.to(arrow, {
                x: 8,
                y: -8,
                scale: 1.15,
                duration: 0.45,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              overwrite: "auto",
            });

            gsap.to(image, {
              x: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              overwrite: "auto",
            });

            gsap.to(content, {
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              overwrite: "auto",
            });

            if (title) {
              gsap.to(title, {
                x: 0,
                duration: 0.6,
                ease: "power3.out",
                overwrite: "auto",
              });
            }

            if (arrow) {
              gsap.to(arrow, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "elastic.out(1, 0.45)",
                overwrite: "auto",
              });
            }
          };

          card.addEventListener(
            "mousemove",
            handleMouseMove
          );

          card.addEventListener(
            "mouseenter",
            handleMouseEnter
          );

          card.addEventListener(
            "mouseleave",
            handleMouseLeave
          );

          card._galleryHandlers = {
            handleMouseMove,
            handleMouseEnter,
            handleMouseLeave,
          };
        }
      });

      /* =====================================================
         SHINE EFFECT
      ===================================================== */

      cards.forEach((card) => {
        const shine = card.querySelector(
          ".gallery-image-shine"
        );

        if (!shine || !isDesktop) return;

        gsap.set(shine, {
          xPercent: -120,
          opacity: 0,
        });

        const handleEnter = () => {
          gsap.fromTo(
            shine,
            {
              xPercent: -120,
              opacity: 0,
            },
            {
              xPercent: 120,
              opacity: 0.35,
              duration: 1.1,
              ease: "power2.inOut",
            }
          );
        };

        card.addEventListener(
          "mouseenter",
          handleEnter
        );

        card._shineHandler = handleEnter;
      });

      /* =====================================================
         CLEANUP
      ===================================================== */

      return () => {
        cards.forEach((card) => {
          const handlers = card._galleryHandlers;

          if (handlers) {
            card.removeEventListener(
              "mousemove",
              handlers.handleMouseMove
            );

            card.removeEventListener(
              "mouseenter",
              handlers.handleMouseEnter
            );

            card.removeEventListener(
              "mouseleave",
              handlers.handleMouseLeave
            );
          }

          if (card._shineHandler) {
            card.removeEventListener(
              "mouseenter",
              card._shineHandler
            );
          }
        });
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="premium-gallery"
      id="gallery"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="premium-gallery-header">
        <div className="premium-gallery-heading">
          <p className="section-label">
            SELECTED EXPERIENCES
          </p>

          <h2>
            MOMENTS
            <br />
            <em>THAT STAY.</em>
          </h2>
        </div>

        <p className="premium-gallery-intro">
          Every celebration deserves its own atmosphere,
          story and unforgettable moment.
        </p>
      </div>

      {/* =================================================
          GALLERY
      ================================================= */}

      <div className="premium-gallery-grid">
        {images.map((item) => (
          <article
            className="premium-gallery-card"
            key={item.number}
          >
            <div className="premium-gallery-image-wrap">
              <img
                src={item.src}
                alt={`${item.title} event`}
                className="premium-gallery-image"
                loading="lazy"
                draggable="false"
              />

              <div className="premium-gallery-overlay" />

              <div className="gallery-image-shine" />
            </div>

            <div className="gallery-card-content">
              <span className="gallery-number">
                {item.number}
              </span>

              <h3 className="gallery-card-title">
                {item.title}
              </h3>

              <span className="gallery-arrow">
                ↗
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default EventGallery;