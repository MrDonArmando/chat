import React from "react";
import "./index.scss";

interface Props {
  styles?: {
    borderColor?: string;
    margin?: string;
  };
}

const Spinner: React.FC<Props> = ({
  styles: { borderColor, margin } = {
    borderColor: "dodgerblue",
    margin: "auto",
  },
}) => (
  <div className="lds-ring" style={{ margin }}>
    {/* <div></div>
    <div></div>
    <div></div>
    <div></div> */}

    {Array.from({ length: 4 }).map((_, index) => (
      <div
        style={{
          borderColor: `${borderColor} transparent transparent transparent`,
        }}
      ></div>
    ))}
  </div>
);

export default Spinner;
