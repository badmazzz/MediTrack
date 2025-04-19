import React, { useContext, useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "./Contact.css";
import { StoreContext } from "../../context/StoreContext";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const {contact} = useContext(StoreContext)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
contact(formData)
    setFormData({ name: "", email: "", phone: "", details: "" });
  };

  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row">
          {/* Contact Info */}
          <div className="col-lg-6" data-aos="fade-right">
            <div className="mb-4">
              <span className="text-orange fw-bold fs-1">Contact Us</span>
              <h2 className="text-dark fw-bold text-uppercase mt-3">
                GET IN TOUCH WITH US
              </h2>
              <p className="text-muted fs-5">
                Have questions or need assistance? Reach out to us anytime.
                We're here to help you with all your medical distribution needs.
              </p>
            </div>

            <ContactInfo
              icon={<FaMapMarkerAlt size={24} color="white" />}
              title="Our Location"
              content="Nikol char rasta, Nikol, Ahmedabad, Gujarat"
              delay="200"
            />
            <ContactInfo
              icon={<FaPhoneAlt size={24} color="white" />}
              title="Phone Number"
              content="(+91) 92659 27392"
              delay="400"
            />
            <ContactInfo
              icon={<FaEnvelope size={24} color="white" />}
              title="Email Address"
              content="pmeshw12012004@gmail.com"
              delay="600"
            />
          </div>

          {/* Contact Form */}
          <div className="col-lg-6" data-aos="fade-left">
            <div className="bg-white shadow rounded">
              <form onSubmit={handleSubmit}>
                <ContactInputBox
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <ContactInputBox
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <ContactInputBox
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <ContactTextArea
                  rows="6"
                  placeholder="Your Message"
                  name="message"
                  value={formData.details}
                  onChange={handleChange}
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
  );
};

export default Contact;

// Reusable Contact Info Component
const ContactInfo = ({ icon, title, content, delay }) => (
  <div
    className="d-flex align-items-center mb-4"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="bg-orange p-3 rounded-circle me-3">{icon}</div>
    <div>
      <h4 className="text-dark fw-bold">{title}</h4>
      <p className="text-muted mb-0">{content}</p>
    </div>
  </div>
);

const ContactTextArea = ({ rows, placeholder, name, value, onChange }) => (
  <div className="mb-3">
    <textarea
      rows={rows}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className="form-control"
    />
  </div>
);

const ContactInputBox = ({ type, placeholder, name, value, onChange }) => (
  <div className="mb-3">
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className="form-control"
    />
  </div>
);
