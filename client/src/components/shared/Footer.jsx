import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#00040A] text-gray-300 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {/* About Section */ }
          <div>
            <h3 className="text-[15px] font-semibold mb-2 text-[#535bf2]">About TechJobHub</h3>
            <p className="text-gray-400 text-sm">
              Connecting talented professionals with innovative companies worldwide.
            </p>
          </div>
          {/* Quick Links Section */ }
          <div>
            <h3 className="text-[15px] font-semibold mb-2 text-[#535bf2]">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-[#535bf2] transition">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-[#535bf2] transition">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#535bf2] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#535bf2] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* Resources Section */ }
          <div>
            <h3 className="text-[15px] font-semibold mb-2 text-[#535bf2]">Resources</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-[#535bf2] transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-[#535bf2] transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-[#535bf2] transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          {/* Connect With Us Section */ }
          <div>
            <h3 className="text-[15px] font-semibold mb-2 text-[#535bf2]">Connect With Us</h3>
            <div className="flex space-x-2">
              <a href="#" className="hover:text-[#535bf2] transition" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#535bf2] transition" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#535bf2] transition" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#535bf2] transition" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        {/* Footer Bottom */ }
        <div className="mt-2 pt-2 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            © { new Date().getFullYear() } TechJobHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
