import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ContactModal from "./modals/ContactModal";

export default function TopBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleResortsClick = (e) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      // Not on home, navigate there and pass a state
      navigate("/", { state: { scrollTo: "resorts" } });
    } else {
      // Already on home, scroll immediately
      const element = document.getElementById("resorts");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600 cursor-pointer">
            Prototype
          </Link>

          <div className="hidden md:flex gap-8 font-medium text-gray-700">
            <a
              href="#resorts"
              onClick={handleResortsClick}
              className="hover:text-blue-600 transition"
            >
              Resorts
            </a>
            <a href="#about" onClick={() => {
              const element = document.getElementById("about");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }} className="hover:text-blue-600 transition">
              About
            </a>
            <button onClick={() => setIsModalOpen(true)} className="hover:text-blue-600 transition">
              Contact
            </button>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-2">Feel free to reach out via email or phone!</p>
        <p className="text-gray-600 mb-2">+63 9XX-XXX-XXXX</p>
        <a href="mailto:name@example.com" className="text-blue-600">name@example.com</a>
      </ContactModal>
    </>
  );
}
