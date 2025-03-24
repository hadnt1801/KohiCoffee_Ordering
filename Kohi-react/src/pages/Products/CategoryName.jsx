import React, { useEffect, useState } from "react";

const CategoryName = ({ categoryId }) => {
  const [categoryName, setCategoryName] = useState("Đang tải...");

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await fetch(`https://coffeeshop.ngrok.app/api/category/${categoryId}`);
        const data = await response.json();
        setCategoryName(data.categoryName || "Không có tên");
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        setCategoryName("Lỗi tải danh mục");
      }
    };

    if (categoryId) {
      fetchCategoryName();
    }
  }, [categoryId]);

  return <span>{categoryName}</span>;
};

export default CategoryName;
