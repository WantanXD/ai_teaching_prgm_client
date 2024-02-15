import React, { useState } from 'react';
import { SidebarData } from "./SidebarData";

function Sidebar() {

    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const handleRowClick = (rowId: number): void => {
      setSelectedRow((prevId) => (prevId === rowId ? null : rowId));
    }
    return(
      <div className="Sidebar">
        <ul className="SidebarList">
            {SidebarData.map((value, key) => {
              return (
                <li 
                  key={key}
                  id={selectedRow === key ? "row-active" : "row"}
                  className="row" 
                  onClick={() => {
                    window.location.pathname = value.link; 
                  }}
                  onMouseOver={() => handleRowClick(key)}
                >
                  <div id="icon" className={
                    selectedRow === key ? "icon-active" : "icon"
                  }>{value.icon}</div>
                  <div id="title">{value.title}</div>
                  <div id="debug">{selectedRow}</div>
                </li>
              )}
            )}
        </ul>
      </div>
    )
}

export default Sidebar;