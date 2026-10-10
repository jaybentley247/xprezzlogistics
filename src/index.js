import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import XprezzLogistics from "./XprezzLogistics";
import QuotePage from "./QuotePage";
import TrackerPage from "./TrackerPage";
import ContactPage from "./ContactPage";
import AboutPage from "./AboutPage";
import ServicesPage from "./ServicesPage";
import ChatWidget from "./ChatWidget";
import Footer from "./Footer";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import ShipmentDetails from "./ShipmentDetails";
import InvoicePage from "./InvoicePage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChatWidget />
    <Routes>
      <Route path="/" element={<XprezzLogistics />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/quote" element={<QuotePage />} />
      <Route path="/tracking" element={<TrackerPage />} />
      <Route path="/shipment/:id" element={<ShipmentDetails />} />
      <Route path="/invoice/:id" element={<InvoicePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
    <Footer />
  </BrowserRouter>,
);
