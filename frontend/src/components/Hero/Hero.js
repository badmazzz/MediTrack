import React, { useEffect } from "react";
import "./Hero.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";

const Hero = () => {
  return (
    <div className="bg-white d-flex align-items-center justify-content-between">
      <section className="bg-light w-100 no-top-padding py-5">
        {" "}
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 pe-5" data-aos="fade-right">
              {" "}
              <p className="text-uppercase fs-4 fw-semibold mb-2 py-3">
                Your Trusted Medical Supplier
              </p>
              <h1 className="display-3 fw-bold text-dark mb-4">
                Welcome to <span className="text-warning">MediTrack</span>
              </h1>
              <p className="text-dark fs-4 mb-4">
                Reliable medicine distribution for C&F companies with{" "}
                <strong>real-time stock updates</strong>,{" "}
                <strong>automated order management</strong>, and{" "}
                <strong>seamless delivery tracking</strong>.
              </p>
              <Link
                to="/products"
                className="btn btn-warning rounded-pill px-5 py-3 text-dark fw-semibold d-inline-flex align-items-center justify-content-between shadow-sm hover-scale"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                Explore Our Products
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ms-2"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.854 4.646a.5.5 0 0 1 0 .708L7.207 9H13a.5.5 0 0 1 0 1H7.207l3.647 3.646a.5.5 0 0 1-.708.708l-4.5-4.5a.5.5 0 0 1 0-.708l4.5-4.5a.5.5 0 0 1 .708 0z"
                  />
                </svg>
              </Link>
            </div>

            <div className="col-lg-6 ps-5" data-aos="fade-left">
              {" "}
              <img
                src={assets.hero}
                alt="MediTrack Medicine Distribution"
                className="img-fluid"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
