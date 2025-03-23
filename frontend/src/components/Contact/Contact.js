import React, { useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "aos/dist/aos.css";
import "./Contact.css";

const Contact = () => {

  return (
    <>
      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="mb-4">
                <span className="text-orange fw-bold fs-1">Contact Us</span>
                <h2 className="text-dark fw-bold text-uppercase mt-3">
                  GET IN TOUCH WITH US
                </h2>
                <p className="text-muted fs-5">
                  Have questions or need assistance? Reach out to us anytime.
                  We're here to help you with all your medical distribution
                  needs.
                </p>
              </div>

              <div
                className="d-flex align-items-center mb-4"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="bg-orange p-3 rounded-circle me-3">
                  <FaMapMarkerAlt size={24} color="white" />
                </div>
                <div>
                  <h4 className="text-dark fw-bold">Our Location</h4>
                  <p className="text-muted mb-0">
                    Nikol char rasta, Nikol, Ahmedabad, Gujarat
                  </p>
                </div>
              </div>

              <div
                className="d-flex align-items-center mb-4"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="bg-orange p-3 rounded-circle me-3">
                  <FaPhoneAlt size={24} color="white" />
                </div>
                <div>
                  <h4 className="text-dark fw-bold">Phone Number</h4>
                  <p className="text-muted mb-0">(+91) 92659 27392</p>
                </div>
              </div>

              <div
                className="d-flex align-items-center mb-4"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <div className="bg-orange p-3 rounded-circle me-3">
                  <FaEnvelope size={24} color="white" />
                </div>
                <div>
                  <h4 className="text-dark fw-bold">Email Address</h4>
                  <p className="text-muted mb-0">pmeshw12012004@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-left">
              <div className="bg-white shadow rounded">
                <form>
                  <ContactInputBox
                    type="text"
                    name="name"
                    placeholder="Your Name"
                  />
                  <ContactInputBox
                    type="email"
                    name="email"
                    placeholder="Your Email"
                  />
                  <ContactInputBox
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                  />
                  <ContactTextArea
                    row="6"
                    placeholder="Your Message"
                    name="details"
                    defaultValue=""
                  />
                  <div>
                    <button
                      type="submit"
                      className="btn btn-orange w-100 py-3"
                      data-aos="zoom-in"
                      data-aos-delay="800"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

const ContactTextArea = ({ row, placeholder, name, defaultValue }) => {
  return (
    <div className="mb-3">
      <textarea
        rows={row}
        placeholder={placeholder}
        name={name}
        className="form-control"
        defaultValue={defaultValue}
      />
    </div>
  );
};

const ContactInputBox = ({ type, placeholder, name }) => {
  return (
    <div className="mb-3">
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        className="form-control"
      />
    </div>
  );
};
