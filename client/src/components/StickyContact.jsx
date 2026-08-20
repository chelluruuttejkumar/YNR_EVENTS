
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

import "../styles/sticky-contact.css";

function StickyContact() {
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  useLayoutEffect(() => {
    const desktop = desktopRef.current;
    const mobile = mobileRef.current;

    if (!desktop && !mobile) return;

    const ctx = gsap.context(() => {
      gsap.set(desktop, {
        y: 30,
        opacity: 0,
      });

      gsap.set(mobile, {
        y: 80,
        opacity: 0,
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let desktopShown = false;
    let mobileShown = false;

    const updateVisibility = () => {
      const shouldShow = window.scrollY > 500;

      if (shouldShow && !desktopShown) {
        desktopShown = true;

        gsap.to(desktopRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power4.out",
        });
      }

      if (!shouldShow && desktopShown) {
        desktopShown = false;

        gsap.to(desktopRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.4,
          ease: "power3.out",
        });
      }

      if (shouldShow && !mobileShown) {
        mobileShown = true;

        gsap.to(mobileRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power4.out",
        });
      }

      if (!shouldShow && mobileShown) {
        mobileShown = false;

        gsap.to(mobileRef.current, {
          y: 80,
          opacity: 0,
          duration: 0.4,
          ease: "power3.out",
        });
      }
    };

    window.addEventListener(
      "scroll",
      updateVisibility,
      { passive: true }
    );

    updateVisibility();

    return () => {
      window.removeEventListener(
        "scroll",
        updateVisibility
      );
    };
  }, []);

  return (
    <>
      {/* ==================================================
          DESKTOP CTA
      ================================================== */}

      <div
        ref={desktopRef}
        className="sticky-contact-desktop"
      >
        <a
          href="#enquiry"
          className="sticky-contact-button"
        >
          <span>ENQUIRE NOW</span>
          <span className="sticky-contact-arrow">
            ↗
          </span>
        </a>
      </div>

      {/* ==================================================
          MOBILE CTA
      ================================================== */}

      <div
        ref={mobileRef}
        className="sticky-contact-mobile"
      >
        <a
          href="https://wa.me/917569862230"
          target="_blank"
          rel="noreferrer"
          className="sticky-mobile-action"
        >
          <span className="sticky-mobile-icon">
            W
          </span>

          <span>WhatsApp</span>
        </a>

        <a
          href="tel:7569862230"
          className="sticky-mobile-action"
        >
          <span className="sticky-mobile-icon">
            T
          </span>

          <span>Call</span>
        </a>

        <a
          href="#enquiry"
          className="sticky-mobile-action sticky-mobile-main"
        >
          <span>ENQUIRE</span>

          <span className="sticky-mobile-arrow">
            ↗
          </span>
        </a>
      </div>
    </>
  );
}

export default StickyContact;

