import React from "react";

const Sidebar = ({ items, onSelect }) => {
  return (
    <div className="sidebar">
      <ul>
        {Object.keys(items).map((key) => (
          <li key={key} onClick={() => onSelect(key)}>
            {key}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;