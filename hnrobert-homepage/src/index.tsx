import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Page from "./app/page";
import RootLayout from "./app/layout";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <RootLayout>
    <Page />
  </RootLayout>
);
