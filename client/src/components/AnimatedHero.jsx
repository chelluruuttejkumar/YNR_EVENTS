import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AnimatedHero() {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const spotlightRef = useRef(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".hero-word");
      const metaItems = gsap.utils.toArray(".hero-meta > *");
      const buttons = gsap.utils.toArray(".hero-button");
      const particles = gsap.utils.toArray(".hero-particle");

      /* =========================
         INITIAL STATES
      ========================= */

      gsap.set(imageRef.current, {
        scale: 1.18,
        opacity: 0,
      });

      gsap.set(".hero-overlay", {
        opacity: 0,
      });

      gsap.set(metaItems, {
        y: 25,
        opacity: 0,
      });

      gsap.set(words, {
        yPercent: 120,
        opacity: 0,
        rotateX: 75,
      });

      gsap.set(".hero-copy", {
        y: 35,
        opacity: 0,
      });

      gsap.set(".hero-actions-new", {
        y: 30,
        opacity: 0,
      });

      gsap.set(".hero-bottom", {
        y: 20,
        opacity: 0,
      });

      gsap.set(particles, {
        opacity: 0,
        scale: 0,
      });

      /* =========================
         CINEMATIC INTRO
      ========================= */

      const intro = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      intro
        .to(imageRef.current, {
          scale: 1,
          opacity: 1,
          duration: 2.2,
          ease: "power3.out",
        })
        .to(
          ".hero-overlay",
          {
            opacity: 1,
            duration: 1.2,
          },
          "-=1.7"
        )
        .to(
          metaItems,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.7"
        )
        .to(
          words,
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.25,
            stagger: 0.13,
            ease: "power4.out",
          },
          "-=0.4"
        )
        .to(
          ".hero-copy",
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          "-=0.55"
        )
        .to(
          ".hero-actions-new",
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          "-=0.4"
        )
        .to(
          ".hero-bottom",
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          "-=0.3"
        )
        .to(
          particles,
          {
            opacity: 0.8,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.5"
        );

      /* =========================
         IMAGE PARALLAX
      ========================= */

      gsap.to(imageRef.current, {
        yPercent: 10,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      /* =========================
         CONTENT PARALLAX
      ========================= */

      gsap.to(contentRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      /* =========================
         ORBIT
      ========================= */

      const orbit = hero.querySelector(".hero-orbit");

      if (orbit) {
        gsap.to(orbit, {
          rotation: 360,
          duration: 30,
          repeat: -1,
          ease: "none",
        });
      }

      /* =========================
         FLOATING PARTICLES
      ========================= */

      particles.forEach((particle, index) => {
        gsap.to(particle, {
          y: index % 2 === 0 ? -25 : 25,
          x: index % 2 === 0 ? 15 : -15,
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.4,
        });
      });

      /* =========================
         SCROLL LINE
      ========================= */

      const scrollLine = hero.querySelector(
        ".scroll-line span"
      );

      if (scrollLine) {
        gsap.fromTo(
          scrollLine,
          {
            scaleX: 0,
            transformOrigin: "left",
          },
          {
            scaleX: 1,
            duration: 1.8,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
          }
        );
      }

      /* =========================
         DESKTOP MOUSE PARALLAX
      ========================= */

      const isDesktop = window.matchMedia(
        "(pointer: fine) and (min-width: 769px)"
      ).matches;

      let mouseX = 0;
      let mouseY = 0;
      let currentX = 0;
      let currentY = 0;
      let animationFrame;

      const moveHero = (event) => {
        if (!isDesktop) return;

        mouseX =
          (event.clientX / window.innerWidth - 0.5) * 2;

        mouseY =
          (event.clientY / window.innerHeight - 0.5) * 2;

        if (spotlightRef.current) {
          gsap.to(spotlightRef.current, {
            x: event.clientX,
            y: event.clientY,
            duration: 0.7,
            ease: "power3.out",
          });
        }
      };

      const updateMouse = () => {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        if (imageRef.current) {
          gsap.set(imageRef.current, {
            x: currentX * 8,
            y: currentY * 5,
          });
        }

        if (orbit) {
          gsap.set(orbit, {
            x: currentX * 14,
            y: currentY * 14,
          });
        }

        gsap.set(".hero-content-layer", {
          x: currentX * 2.5,
          y: currentY * 2,
        });

        animationFrame =
          requestAnimationFrame(updateMouse);
      };

      if (isDesktop) {
        window.addEventListener(
          "mousemove",
          moveHero,
          { passive: true }
        );

        animationFrame =
          requestAnimationFrame(updateMouse);
      }

      /* =========================
         BUTTON MAGNETIC HOVER
      ========================= */

      buttons.forEach((button) => {
        const arrow = button.querySelector(
          ".button-arrow"
        );

        const enter = () => {
          gsap.to(button, {
            y: -5,
            duration: 0.35,
            ease: "power3.out",
          });

          if (arrow) {
            gsap.to(arrow, {
              x: 8,
              y: -4,
              duration: 0.35,
              ease: "power3.out",
            });
          }
        };

        const leave = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.55,
            ease: "elastic.out(1, 0.45)",
          });

          if (arrow) {
            gsap.to(arrow, {
              x: 0,
              y: 0,
              duration: 0.45,
              ease: "power3.out",
            });
          }
        };

        button.addEventListener("mouseenter", enter);
        button.addEventListener("mouseleave", leave);

        button._heroEnter = enter;
        button._heroLeave = leave;
      });

      /* =========================
         TITLE INTERACTION
      ========================= */

      const title = hero.querySelector(
        ".cinematic-title"
      );

      if (title && isDesktop) {
        const enter = () => {
          gsap.to(".hero-outline", {
            x: 10,
            duration: 0.5,
            ease: "power3.out",
          });
        };

        const leave = () => {
          gsap.to(".hero-outline", {
            x: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
          });
        };

        title.addEventListener("mouseenter", enter);
        title.addEventListener("mouseleave", leave);

        title._heroTitleEnter = enter;
        title._heroTitleLeave = leave;
      }

      /* =========================
         CLEANUP
      ========================= */

      return () => {
        if (isDesktop) {
          window.removeEventListener(
            "mousemove",
            moveHero
          );

          cancelAnimationFrame(animationFrame);
        }

        buttons.forEach((button) => {
          if (button._heroEnter) {
            button.removeEventListener(
              "mouseenter",
              button._heroEnter
            );
          }

          if (button._heroLeave) {
            button.removeEventListener(
              "mouseleave",
              button._heroLeave
            );
          }
        });

        if (title) {
          if (title._heroTitleEnter) {
            title.removeEventListener(
              "mouseenter",
              title._heroTitleEnter
            );
          }

          if (title._heroTitleLeave) {
            title.removeEventListener(
              "mouseleave",
              title._heroTitleLeave
            );
          }
        }
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="hero hero-cinematic"
      ref={heroRef}
    >
      {/* =========================
          HERO BACKGROUND
      ========================= */}

      <div
        ref={imageRef}
        className="hero-image"
        aria-hidden="true"
      />

      <div className="hero-overlay" />
      <div className="hero-vignette" />
      <div className="hero-grain" />

      <div
        ref={spotlightRef}
        className="hero-spotlight"
        aria-hidden="true"
      />

      {/* =========================
          PARTICLES
      ========================= */}

      <span className="hero-particle particle-1" />
      <span className="hero-particle particle-2" />
      <span className="hero-particle particle-3" />
      <span className="hero-particle particle-4" />

      {/* =========================
          ORBIT
      ========================= */}

      <div className="hero-orbit">
        <span>
          YNR · EVENTS · EXPERIENCES · MOMENTS ·
        </span>
      </div>

      {/* =========================
          HERO CONTENT
      ========================= */}

      <div
        ref={contentRef}
        className="hero-content-layer"
      >
        <div className="hero-inner">

          {/* =========================
              TOP META / NAVIGATION
          ========================= */}

          <div className="hero-meta">

            <span className="hero-brand">
              YNR EVENTS
            </span>

            <nav
              className="hero-navigation"
              aria-label="Main navigation"
            >
              <a href="#events">
                EVENTS
              </a>

              <span className="nav-separator">
                ·
              </span>

              <a href="#experiences">
                EXPERIENCES
              </a>

              <span className="nav-separator">
                ·
              </span>

              <a href="#moments">
                MOMENTS
              </a>
            </nav>

          </div>

          {/* =========================
              HERO TITLE
          ========================= */}

          <div className="hero-main">

            <div className="hero-title-mask">

              <h1 className="cinematic-title">

                <span className="hero-word">
                  CREATE
                </span>

                <span className="hero-word hero-outline">
                  UNFORGETTABLE
                </span>

                <span className="hero-word">
                  MOMENTS
                </span>

              </h1>

            </div>

            {/* =========================
                HERO DESCRIPTION
            ========================= */}

            <div className="hero-copy">

              <p>
                We transform celebrations, corporate
                occasions and special moments into
                experiences worth remembering.
              </p>

            </div>

            {/* =========================
                HERO ACTIONS
            ========================= */}

            <div className="hero-actions-new">

              <a
                href="#events"
                className="hero-button hero-button-main"
              >
                <span>
                  Explore Events
                </span>

                <span className="button-arrow">
                  ↗
                </span>
              </a>

              <a
                href="#enquiry"
                className="hero-button hero-button-line"
              >
                <span>
                  Plan Your Event
                </span>

                <span className="button-arrow">
                  →
                </span>
              </a>

            </div>

          </div>

          {/* =========================
              HERO BOTTOM
          ========================= */}

          <div className="hero-bottom">

            <div className="scroll-label">

              <span>
                SCROLL TO DISCOVER
              </span>

              <div className="scroll-line">
                <span />
              </div>

            </div>

            <a
              href="tel:7569862230"
              className="hero-phone"
            >
              +91 75698 62230
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}

export default AnimatedHero;