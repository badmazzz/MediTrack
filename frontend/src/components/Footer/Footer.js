import React from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4" data-aos="fade-right">
            {assets.Logo()}

            <p className="text-muted fs-4 text-align py-4">
              <strong>MediTrack</strong> is your trusted partner for streamlined
              medical distribution. Our platform offers real-time stock updates,
              automated order management, and seamless delivery tracking for C&F
              companies, ensuring efficient and accurate operations.
            </p>

            <div className="d-flex gap-3 mt-4">
              {[
                { icon: <FaTwitter />, platform: "Twitter" },
                { icon: <FaFacebook />, platform: "Facebook" },
                { icon: <FaInstagram />, platform: "Instagram" },
                { icon: <FaGithub />, platform: "Github" },
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="btn rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "50px", height: "50px", fontSize: "1.5rem" }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2" data-aos="fade-right">
            <h5 className="text-uppercase text-muted fs-4">Company</h5>
            <ul className="list-unstyled mt-3">
              {["About", "Features", "Works", "Career"].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-decoration-none text-dark fw-medium d-block py-2 fs-4 hover-opacity"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2" data-aos="fade-left">
            <h5 className="text-uppercase text-muted fs-4">Help</h5>
            <ul className="list-unstyled mt-3">
              {[
                "Customer Support",
                "Delivery Details",
                "Terms & Conditions",
                "Privacy Policy",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-decoration-none text-dark fw-medium d-block py-2 fs-4 hover-opacity"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4" data-aos="fade-left">
            <h5 className="text-uppercase text-muted fs-4">
              Subscribe to Newsletter
            </h5>
            <form className="mt-3">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control rounded-start fs-4 mb-0"
                  placeholder="Enter your email"
                  required
                />
                <button type="submit" className="btn btn-dark fs-4">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr className="my-5" />
        <p className="text-center text-muted fs-4">
          © Copyright 2025, All Rights Reserved by MEDITRACK
        </p>
      </div>
    </section>
  );
};

export default Footer;
