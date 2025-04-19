import React, { useContext } from "react";
import ProductItem from "../../components/ProductItem/ProductItem";
import { StoreContext } from "../../context/StoreContext";

const ProductDisplay = () => {
  const { products } = useContext(StoreContext);

  return (
    <section className="py-5 bg-light">
      <div className="text-center mb-5">
        <h2 className="display-6 fw-bold">Our Medical Products</h2>
        <p className="lead text-muted">
          High-quality medical supplies for all your healthcare needs
        </p>
      </div>

      <div className="row g-4 d-flex justify-content-evenly">
        {products.map((product) => (
          <div key={product._id} className="col-sm-6 col-md-4 col-lg-3">
            <ProductItem
              _id={product._id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              quantity={product.quantity}
              expiryDate={product.expiryDate}
              productImage={product.productImage}
              category={product.category}
              isNew={product.isNew}
              isSale={product.isSale}
              rating={product.rating}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductDisplay;
