import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import DigitalServices from "@/components/DigitalServices";
import Advantages from "@/components/Advantages";
import WorkProcess from "@/components/WorkProcess";
import Geography from "@/components/Geography";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Services />
      <DigitalServices />
      <Advantages />
      <WorkProcess />
      <Geography />
      <CTA />
      <Footer />
    </>
  );
}
