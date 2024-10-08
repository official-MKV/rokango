import React from "react";

const page = () => {
  return (
    <div>
      <div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
        <p className="text-xl">
          Manage your retailers and suppliers with ease.
        </p>
      </div>
    </div>
  );
};

export default page;
