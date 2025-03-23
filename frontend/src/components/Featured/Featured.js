import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "aos/dist/aos.css";

const Featured = () => {
  const { products, category } = useContext(StoreContext);
  const categories = category(products);

  return (
    <section className="py-5 bg-light">
      <div className="container px-4 mx-auto">
        <div className="text-center" data-aos="fade-up">
          <h2 className="fs-2 font-bold text-dark mb-4">
            Make every step user-centric
          </h2>
          <div className="d-flex justify-content-center">
            <p className="text-base text-muted w-75 text-center fs-5">
              Our E-Commerce Platform with Integrated Inventory Management
              offers a seamless shopping experience with{" "}
              <strong>real-time stock updates</strong>,
              <strong> easy order management</strong>, and{" "}
              <strong>intuitive navigation</strong>. Built with the MERN stack,
              it ensures high performance and scalability.
            </p>
          </div>
        </div>

        <div className="row mt-5">
          {categories.map((category, index) => (
            <div
              key={index}
              className="col-md-6 col-lg-4 mb-4 p-4 text-center"
              data-aos="zoom-in"
              data-aos-delay={`${index * 200}`}
            >
              <div className="mx-auto mb-4 text-dark">{category.icon}</div>
              <h3 className="h4 font-bold text-dark mb-3 fs-2">
                {category.name}
              </h3>
              <p className="text-muted fs-4">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
