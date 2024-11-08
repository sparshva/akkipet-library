import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <HelmetProvider>
      {/* <React.StrictMode> */}

      <BrowserRouter>
        <Helmet>
          <title>Akkipet Gyan Bhandar</title>
          <meta
            name="description"
            content="Explore Akkipet Gyan Bhandar for a diverse collection of books, authors, and educational resources."
          />
          <meta
            name="keywords"
            content="Akkipet library,jain library, jain gyan bhandar, akkipet jain library, books, educational resources, authors, book topics"
          />
          <meta name="author" content="Akkipet Gyan Bhandar" />
          <meta name="robots" content="index, follow" />
        </Helmet>
        <App />
      </BrowserRouter>
      {/* </React.StrictMode> */}
    </HelmetProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
