import React from 'react';

export default function RibbonNav({ route, setRoute }) {
  const navLinks = [
    { label: "Home", route: "home" },
    { label: "Transactions", route: "transactions" },
    { label: "Schemes", route: "schemes" },
    { label: "Savings", route: "savings" },
    { label: "KYC", route: "kyc" },
    { label: "Education Hub", route: "education" },
    { label: "Help & Support", route: "help" },
    { label: "Profile", route: "profile" }
  ];

  return (
    // Uses .ribbon-nav for the container styling (from index.css)
    <nav className="ribbon-nav">
      {navLinks.map(link => (
        // Uses .ribbon-item for button styling and .active for selection
        <button
          key={link.route}
          onClick={() => setRoute(link.route)}
          className={`ribbon-item ${route === link.route ? 'active' : ''}`}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
}