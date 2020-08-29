import React from "react";
import ReactDom from "react-dom";
import "./index.scss";

interface Props {
  open: boolean;
  children: React.ReactNode;
  onClose:
    | ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
    | undefined;
  getCroppedImg:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
}

const Modal = ({ open, children }: Props) => {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div id="overlay">{children}</div>
    </>,
    document.getElementById("portal") as Element
  );
};

export default Modal;
