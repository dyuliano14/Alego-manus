import React from "react";

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main className="simple-container flex flex-col gap-6">
      {children}
    </main>
  );
};

export default Main;
