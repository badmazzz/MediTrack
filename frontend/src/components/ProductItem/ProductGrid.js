import React from "react";
import ProductItem from "./ProductItem";

const ProductGrid = ({ products }) => {
  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Our Medical Products
          </h2>
          <p className="mt-4 text-base font-normal leading-7 text-gray-600">
            High-quality medical supplies for all your healthcare needs
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
              expiryDate={product.expiryDate}
              productImage={product.productImage}
              category={product.category}
              isNew={product.isNew}
              isSale={product.isSale}
              originalPrice={product.originalPrice}
              rating={product.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
