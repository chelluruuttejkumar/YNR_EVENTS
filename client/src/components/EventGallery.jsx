import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=90",
    title: "Weddings",
    number: "01",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=90",
    title: "Celebrations",
    number: "02",
  },
  {
    src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1600&q=90",
    title: "Corporate",
    number: "03",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=90",
    title: "Private Events",
    number: "04",
  },
];

function EventGallery() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".premium-gallery-card");

      cards.forEach((card, index) => {
        const image = card.querySelector(".premium-gallery-image");
        const content = card.querySelector(".gallery-card-content");

        gsap.fromTo(
          card,
          {
            y: 70,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          image,
          {
            scale: 1.08,
          },
          {
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          content,
          {
            y: 25,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: index * 0.08 + 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="premium-gallery"
      ref={sectionRef}
      id="gallery"
    >
      <div className="premium-gallery-header">
        <div>
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

      <div className="premium-gallery-grid">
        {images.map((item) => (
          <article
            className="premium-gallery-card"
            key={item.number}
          >
            <div className="premium-gallery-image-wrap">
              <img
                src={item.src}
                alt={item.title}
                className="premium-gallery-image"
                loading="lazy"
              />

              <div className="premium-gallery-overlay" />
            </div>

            <div className="gallery-card-content">
              <span>{item.number}</span>

              <h3>{item.title}</h3>

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