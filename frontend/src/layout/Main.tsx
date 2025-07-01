import React from "react";

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main className="main-container py-8 min-h-[60vh]">
      {children}
    </main>
  );
};

export default Main;
