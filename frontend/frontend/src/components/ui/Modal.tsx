import React from "react";
import { Button } from "./button";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
  <div className="modal-backdrop">
    <div className="modal-window">
      <header className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button onClick={onClose}>✕</button>
      </header>
      <div>{children}</div>
    </div>
  </div>
);
};

export default Modal;
