import React from "react";

const Content = ({ data }) => {
  if (!data) {
    return (
      <div className="content">
        <h2>Welcome</h2>
        <p>Select a property from the sidebar to see details.</p>
      </div>
    );
  }

  return (
    <div className="content">
      <h2>{data.title}</h2>
      <p>{data.description}</p>
    </div>
  );
};

export default Content;