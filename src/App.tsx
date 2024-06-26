import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceList from "./components/InvoiceList";
import Dashboard from "./components/Dashboard";
import InvoiceLibrary from "./components/InvoiceLibrary";
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/upload-invoice" element={<InvoiceForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<InvoiceLibrary />} />
        </Routes>
      </main>
    </>
  );
};

export default App; 
