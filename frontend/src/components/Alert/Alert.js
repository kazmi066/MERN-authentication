import React from "react";
import "./Alert.css";

export default function Alert({ children, type }) {
  return (
    <div>
      <div
        className={
          type === "success" ? "alert-box success" : "alert-box failure"
        }
      >
        {children}
      </div>
    </div>
  );
}
