import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import Feedbacks from "./pages/Feedbacks/Feedbacks";
import FeedbackDetail from "./pages/Feedbacks/FeedbackDetail" 
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/Login";

const App = () => {
  const url = "http://localhost:4000"
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>

          <Route path="/" element={<Login url={url}/>} />
          <Route path="/edit-food/:id" element={<Add url={url}/>} />
          <Route path="/add" element={<Add url={url}/>} />
          <Route path="/list" element={<List url={url}/>} />
          <Route path="/orders" element={<Orders url={url}/>} />
          <Route path="/feedbacks" element = {<Feedbacks url={url}/>} />
          <Route path="/admin/feedbacks/:id" element={<FeedbackDetail url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
