import React, { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation, useSearchParams } from "react-router-dom";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import useDocumentTitle from "../../utils/documentTitle";
import GetAllProducts from "./GetAllProducts";

function Products(props) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (location.pathname === "/products" && !searchParams.has("q")) {
      setSearchParams({ q: "all" });
    }
  }, [location.pathname, searchParams, setSearchParams]);

  useDocumentTitle(props.title);

  // Hàm cập nhật bộ lọc
  const handleFilterChange = (type) => {
    const currentSortBy = searchParams.get("sortBy");
    const currentOrder = searchParams.get("order") || "asc";

    // Đổi trạng thái tăng/giảm dần
    const newOrder = currentSortBy === type && currentOrder === "asc" ? "desc" : "asc";

    // Cập nhật `searchParams`
    setSearchParams({ ...Object.fromEntries(searchParams), sortBy: type, order: newOrder });
  };

  return (
    <>
      <Header />
      <main className="flex flex-col md:flex-row global-px">
        <section className="flex-[2_2_0%] flex flex-col md:pl-16 py-5">
          {/* Tabs */}
          <nav className="list-none flex flex-row md:justify-between justify-evenly flex-wrap gap-5 mb-10">
            <li>
              <NavLink to="/products?q=all" end className={({ isActive }) => isActive ? "text-white bg-primary px-4 py-2 rounded-full shadow-md" : "text-gray-600"}>
                All
              </NavLink>
            </li>
            <li>
              <NavLink to="/products/category/1" className={({ isActive }) => isActive ? "text-white bg-primary px-4 py-2 rounded-full shadow-md" : "text-gray-600"}>
                Espresso
              </NavLink>
            </li>
            <li>
              <NavLink to="/products/category/2" className={({ isActive }) => isActive ? "text-white bg-primary px-4 py-2 rounded-full shadow-md" : "text-gray-600"}>
                Cappuccino
              </NavLink>
            </li>
            <li>
              <NavLink to="/products/category/3" className={({ isActive }) => isActive ? "text-white bg-primary px-4 py-2 rounded-full shadow-md" : "text-gray-600"}>
                Latte
              </NavLink>
            </li>
            <li>
              <NavLink to="/products/category/4" className={({ isActive }) => isActive ? "text-white bg-primary px-4 py-2 rounded-full shadow-md" : "text-gray-600"}>
                Americano
              </NavLink>
            </li>
          </nav>

          {/* Bộ lọc */}
          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={() => handleFilterChange("price")}
              className={`px-6 py-2 rounded-full shadow-md transition-all duration-300 ${
                searchParams.get("sortBy") === "price" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Giá {searchParams.get("sortBy") === "price" ? (searchParams.get("order") === "asc" ? "⬆️" : "⬇️") : ""}
            </button>
            <button
              onClick={() => handleFilterChange("name")}
              className={`px-6 py-2 rounded-full shadow-md transition-all duration-300 ${
                searchParams.get("sortBy") === "name" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tên {searchParams.get("sortBy") === "name" ? (searchParams.get("order") === "asc" ? "⬆️" : "⬇️") : ""}
            </button>
          </div>

          {/* Danh sách sản phẩm */}
          <Routes>
            <Route index element={<GetAllProducts />} />
            <Route path="category/:catId" element={<GetAllProducts />} />
          </Routes>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Products;
