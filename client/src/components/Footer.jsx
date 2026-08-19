
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/footer.css";

gsap.registerPlugin(ScrollTrigger);

function Footer() {
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;

    if (!footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-main-content",
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
            trigger: footer,
            start: "top 90%",
            toggleActions:
              "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".footer-brand",
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 88%",
            toggleActions:
              "play none none reverse",
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="ynr-footer"
      ref={footerRef}
    >
      <div className="footer-container">

        <div className="footer-main-content">

          <div className="footer-brand">
            <p className="footer-eyebrow">
              YNR EVENTS
            </p>

            <h2>
              MAKE IT
              <br />
              <em>MEMORABLE.</em>
            </h2>

            <p className="footer-description">
              Weddings, celebrations, corporate
              experiences and moments designed to
              stay with you long after the night ends.
            </p>

            <a
              href="#enquiry"
              className="footer-primary-cta"
            >
              <span>
                Start a conversation
              </span>

              <span>↗</span>
            </a>
          </div>

          <div className="footer-columns">

            <div className="footer-column">
              <p className="footer-column-label">
                EXPLORE
              </p>

              <a href="/#about">
                About
              </a>

              <a href="/#events">
                Events
              </a>

              <a href="/experiences">
                Experiences
              </a>

              <a href="/#gallery">
                Moments
              </a>

              <a href="/#packages">
                Packages
              </a>

              <a href="/#faq">
                FAQ
              </a>
            </div>

            <div className="footer-column">
              <p className="footer-column-label">
                CONTACT
              </p>

              <a href="tel:7569862230">
                +91 75698 62230
              </a>

              <a href="mailto:ynreventsofficial@gmail.com">
                ynreventsofficial@gmail.com
              </a>

              <a href="https://wa.me/917569862230">
                WhatsApp
              </a>
            </div>

            <div className="footer-column">
              <p className="footer-column-label">
                FOLLOW
              </p>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </div>

          </div>

        </div>

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()}
            {" "}
            YNR Events. All rights reserved.
          </p>

          <button
            type="button"
            className="footer-top"
            onClick={scrollToTop}
          >
            BACK TO TOP
            <span>↑</span>
          </button>

        </div>

      </div>
    </footer>
  );
}

export default Footer;

