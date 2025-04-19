import React from "react";
import { Container, Row, Col, Breadcrumb, Button, Form } from "react-bootstrap";
import { FaHeart, FaTimes } from "react-icons/fa";

const ProductDetails = ({ onClose }) => {
  return (
    <Container className="p-4">
      <Button
        variant="light"
        onClick={onClose}
        className="position-absolute top-0 end-0 m-3 p-2 rounded-circle shadow-sm"
      >
        <FaTimes />
      </Button>

      <Row>
        {/* Product Image */}
        <Col lg={6} className="mb-4">
          <div className="position-relative">
            <img
              src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/product-details/3/product-1.png"
              alt="Nike Sneakers"
              className="img-fluid rounded shadow"
            />

            {/* Rating Stars */}
            <div className="position-absolute bottom-0 start-0 bg-white p-2 rounded m-3 shadow-sm">
              <div className="d-flex">
                <div className="text-warning me-1">&#9733;</div>
                <div className="text-warning me-1">&#9733;</div>
                <div className="text-warning me-1">&#9733;</div>
                <div className="text-warning me-1">&#9733;</div>
                <div className="text-secondary">&#9733;</div>
              </div>
            </div>
          </div>
        </Col>

        {/* Product Details */}
        <Col lg={6}>
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="#">Products</Breadcrumb.Item>
            <Breadcrumb.Item active>Nike Sneakers</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="fw-bold">Nike Sneakers Shoes for Running Men</h1>

          <p className="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut amet a a
            blandit id non viverra massa semper.
          </p>

          <h5 className="fw-bold">Highlights:</h5>
          <ul className="list-unstyled">
            <li>✅ Made with full cotton</li>
            <li>✅ Slim fit for any body</li>
            <li>✅ Quality control by JC</li>
          </ul>

          {/* Options */}
          <Row className="g-3 mb-4">
            <Col md={4}>
              <Form.Group controlId="colorSelect">
                <Form.Label>Color</Form.Label>
                <Form.Select>
                  <option>White</option>
                  <option>Black</option>
                  <option>Blue</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="sizeSelect">
                <Form.Label>Size</Form.Label>
                <Form.Select>
                  <option>40</option>
                  <option>42</option>
                  <option>44</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="text-end">
              <p className="h4 fw-bold">$49.00</p>
            </Col>
          </Row>

          {/* Buttons */}
          <div className="d-flex gap-3">
            <Button variant="primary" size="lg" className="flex-grow-1">
              Add to cart
            </Button>
            <Button
              variant="outline-secondary"
              size="lg"
              className="flex-grow-1 d-flex align-items-center justify-content-center"
            >
              <FaHeart className="me-2" />
              Add to wishlist
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
