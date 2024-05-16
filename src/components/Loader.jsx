import React from "react";

const Loader = ({ modified }) => {
  if (modified) {
    return (
      <div className="bg-neutral-900 h-full w-full flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="bg-neutral-900 absolute top-0 left-0 h-screen w-full flex justify-center items-center">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
};

export default Loader;
