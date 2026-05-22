"use client";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Team", href: "#team" },
  { label: "Contacts", href: "#contacts" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-5">
      {/* Logo */}
      <a href="#top" className="text-foreground text-xl font-semibold tracking-tight">
        SENTINEL
      </a>

      {/* Center nav links */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Right: Get Quote button */}
      <button
        type="button"
        className="hidden md:inline-flex items-center justify-center text-foreground bg-nav-button hover:bg-nav-button/80 active:scale-[0.97] transition-all rounded-lg uppercase text-xs tracking-widest px-6 py-3"
      >
        Get Quote
      </button>
    </header>
  );
}
