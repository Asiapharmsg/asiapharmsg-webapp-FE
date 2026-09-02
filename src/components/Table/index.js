import React from "react";

const Table = ({ headers, data }) => {
  return (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          {headers.map((header, h_index) => (
            <th key={h_index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i_index) => (
          <tr key={i_index}>
            {Object.keys(row).map((item) => (
              <td key={item}>{row[item]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
