import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["Home", "Events", "Services", "Gallery", "About"];

  return (
    <header className="navbar">
      <a href="/" className="logo">
        <span>YNR</span>
        <small>EVENTS</small>
      </a>

      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </a>
        ))}

        <a
          href="#booking"
          className="nav-book"
          onClick={() => setMenuOpen(false)}
        >
          Book Event
        </a>
      </nav>

      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </header>
  );
}

export default Navbar;