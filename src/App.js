import React from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import { InitializeProjectSetup } from "Views/Common/Docs/InitializeProjectSetup";
import Error from "Views/Common/Docs/error";
import Home from "Home";
import ChatPage from "ChatPage";


const App = () => {

  return (
    <HelmetProvider>
      <ToastContainer theme='light' />
      <Routes>      
        <Route element={<InitializeProjectSetup />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage/>} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </HelmetProvider >
  )
}
export default App;