import React from "react";

const NewsCard= ({ title, content, date }) => {
  return (
    <div className="bg-white p-4 mt-2 rounded-lg shadow-md mb-4">
      <h2 className="text-violet-700 text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 mb-4">{content}</p>
      <div className="flex items-center justify-end">
        <p className="text-gray-600">{date}</p>
      </div>
    </div>
  );
};

export default NewsCard;
