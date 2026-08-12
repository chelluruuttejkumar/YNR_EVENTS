import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AnimatedHero() {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".hero-word");
      const metaItems = gsap.utils.toArray(".hero-meta > *");
      const buttons = gsap.utils.toArray(".hero-button");

      /*
       * --------------------------------
       * CINEMATIC HERO INTRO
       * --------------------------------
       */

      const intro = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      gsap.set(
        [
          imageRef.current,
          ".hero-overlay",
          ".hero-meta > *",
          ".hero-word",
          ".hero-copy",
          ".hero-actions-new",
          ".hero-bottom",
        ],
        {
          willChange: "transform, opacity",
        }
      );

      gsap.set(imageRef.current, {
        scale: 1.16,
        opacity: 0.85,
      });

      gsap.set(".hero-overlay", {
        opacity: 0,
      });

      gsap.set(metaItems, {
        y: 20,
        opacity: 0,
      });

      gsap.set(words, {
        yPercent: 110,
        opacity: 0,
        rotateX: 70,
      });

      gsap.set(".hero-copy", {
        y: 30,
        opacity: 0,
      });

      gsap.set(".hero-actions-new", {
        y: 25,
        opacity: 0,
      });

      gsap.set(".hero-bottom", {
        y: 20,
        opacity: 0,
      });

      intro
        .to(imageRef.current, {
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: "power3.out",
        })
        .to(
          ".hero-overlay",
          {
            opacity: 1,
            duration: 1.1,
          },
          "-=1.5"
        )
        .to(
          metaItems,
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.1,
          },
          "-=0.6"
        )
        .to(
          words,
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.15,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .to(
          ".hero-copy",
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
          },
          "-=0.55"
        )
        .to(
          ".hero-actions-new",
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
          },
          "-=0.4"
        )
        .to(
          ".hero-bottom",
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
          },
          "-=0.3"
        );

      /*
       * --------------------------------
       * HERO IMAGE PARALLAX
       * --------------------------------
       */

      gsap.to(imageRef.current, {
        yPercent: 8,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      /*
       * --------------------------------
       * CONTENT PARALLAX
       * --------------------------------
       */

      gsap.to(contentRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      /*
       * --------------------------------
       * ORBIT
       * --------------------------------
       */

      const orbit = hero.querySelector(".hero-orbit");

      if (orbit) {
        gsap.to(orbit, {
          rotation: 360,
          duration: 28,
          repeat: -1,
          ease: "none",
        });
      }

      /*
       * --------------------------------
       * SCROLL INDICATOR
       * --------------------------------
       */

      const scrollLine = hero.querySelector(".scroll-line span");

      if (scrollLine) {
        gsap.fromTo(
          scrollLine,
          {
            scaleY: 0,
            transformOrigin: "top",
          },
          {
            scaleY: 1,
            duration: 1.4,
            repeat: -1,
            ease: "power2.inOut",
            yoyo: true,
          }
        );
      }

      /*
       * --------------------------------
       * DESKTOP MOUSE PARALLAX
       * --------------------------------
       */

      const isDesktop = window.matchMedia(
        "(pointer: fine) and (min-width: 769px)"
      ).matches;

      let mouseX = 0;
      let mouseY = 0;
      let currentX = 0;
      let currentY = 0;

      const moveHero = (event) => {
        if (!isDesktop) return;

        mouseX =
          (event.clientX / window.innerWidth - 0.5) * 2;

        mouseY =
          (event.clientY / window.innerHeight - 0.5) * 2;
      };

      const updateMouse = () => {
        currentX += (mouseX - currentX) * 0.06;
        currentY += (mouseY - currentY) * 0.06;

        gsap.set(imageRef.current, {
          x: currentX * 7,
          y: currentY * 4,
        });

        if (orbit) {
          gsap.set(orbit, {
            x: currentX * 12,
            y: currentY * 12,
          });
        }

        gsap.set(".hero-content-layer", {
          x: currentX * 2.5,
          y: currentY * 2,
        });

        requestAnimationFrame(updateMouse);
      };

      if (isDesktop) {
        window.addEventListener(
          "mousemove",
          moveHero,
          { passive: true }
        );

        requestAnimationFrame(updateMouse);
      }

      /*
       * --------------------------------
       * BUTTON HOVER
       * --------------------------------
       */

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
              x: 7,
              duration: 0.35,
              ease: "power3.out",
            });
          }
        };

        const leave = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.45)",
          });

          if (arrow) {
            gsap.to(arrow, {
              x: 0,
              duration: 0.4,
              ease: "power3.out",
            });
          }
        };

        button.addEventListener("mouseenter", enter);
        button.addEventListener("mouseleave", leave);

        button._heroEnter = enter;
        button._heroLeave = leave;
      });

      /*
       * --------------------------------
       * TITLE HOVER
       * --------------------------------
       */

      const title = hero.querySelector(
        ".cinematic-title"
      );

      if (title && isDesktop) {
        const handleTitleEnter = () => {
          gsap.to(".hero-outline", {
            x: 8,
            duration: 0.5,
            ease: "power3.out",
          });
        };

        const handleTitleLeave = () => {
          gsap.to(".hero-outline", {
            x: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
          });
        };

        title.addEventListener(
          "mouseenter",
          handleTitleEnter
        );

        title.addEventListener(
          "mouseleave",
          handleTitleLeave
        );

        title._heroTitleEnter = handleTitleEnter;
        title._heroTitleLeave = handleTitleLeave;
      }

      /*
       * --------------------------------
       * CLEANUP
       * --------------------------------
       */

      return () => {
        if (isDesktop) {
          window.removeEventListener(
            "mousemove",
            moveHero
          );
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
      className="hero cinematic-hero"
      ref={heroRef}
    >
      <div
        ref={imageRef}
        className="hero-image"
        aria-hidden="true"
      />

      <div className="hero-overlay" />
      <div className="hero-vignette" />
      <div className="hero-grain" />

      <div className="hero-orbit">
        <span>
          YNR · EVENTS · EXPERIENCES · MOMENTS ·
        </span>
      </div>

      <div
        ref={contentRef}
        className="hero-content-layer"
      >
        <div className="hero-inner">

          <div className="hero-meta">
            <span>YNR EVENTS</span>
            <span>
              EVENTS · EXPERIENCES · MOMENTS
            </span>
          </div>

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

            <div className="hero-copy">
              <p>
                We transform celebrations, corporate
                occasions and special moments into
                experiences worth remembering.
              </p>
            </div>

            <div className="hero-actions-new">

              <a
                href="#events"
                className="hero-button hero-button-main"
              >
                <span>Explore Events</span>
                <span className="button-arrow">
                  ↗
                </span>
              </a>

              <a
                href="#enquiry"
                className="hero-button hero-button-line"
              >
                <span>Plan Your Event</span>
                <span className="button-arrow">
                  →
                </span>
              </a>

            </div>
          </div>

          <div className="hero-bottom">

            <div className="scroll-label">
              <span>SCROLL TO DISCOVER</span>

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