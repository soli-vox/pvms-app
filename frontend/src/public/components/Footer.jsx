import PvmsLogo from "../../assets/pvms-logo.png";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <img className="h-10 w-auto" src={PvmsLogo} alt="PVMS Logo" />
              <span className="ml-3 text-2xl font-bold">PVMS</span>
            </div>
            <p className="text-gray-400 mt-2">
              © 2025 Property Valuation Management System
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-400">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">support@pvms.com</p>
            <p className="text-gray-400">+1 800 123 4567</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
