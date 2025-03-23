import React from "react";
import "./Home.css";
import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";
import Featured from "../../components/Featured/Featured";
import Contact from "../../components/Contact/Contact";

const Home = () => {
  return (
    <>
      <Hero />
      <Featured />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
