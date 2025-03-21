import "react-loading-skeleton/dist/skeleton.css";

import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import Skeleton from "react-loading-skeleton";
import { NavLink, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import images from "../../assets/images/person-with-a-coffee.webp";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import useDocumentTitle from "../../utils/documentTitle";
import GetAllProducts from "./GetAllProducts";

function Products(props) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/products" && !searchParams.has("q")) {
      searchParams.set("q", "all");
      setSearchParams(searchParams);
    }
  }, [location.pathname, searchParams, setSearchParams]);

  useDocumentTitle(props.title);
  return (
    <>
      <Header />
      <main className="flex flex-col md:flex-row global-px">
        <section className="flex-[2_2_0%] flex flex-col md:pl-16 py-5">
          <nav className="list-none flex flex-row md:justify-between justify-evenly flex-wrap gap-5 mb-10 ">
            <li>
              <NavLink to="/products?q=all" end className={({ isActive }) => isActive ? "text-white bg-gray-800 px-4 py-2 rounded" : "text-gray-600"}>All</NavLink>
            </li>
            <li>
              <NavLink to="/products/category/1" className={({ isActive }) => isActive ? "text-white bg-gray-800 px-4 py-2 rounded" : "text-gray-600"}>Espresso</NavLink>
            </li>
            <li>
              <NavLink to="/products/category/2" className={({ isActive }) => isActive ? "text-white bg-gray-800 px-4 py-2 rounded" : "text-gray-600"}>Cappuccino</NavLink>
            </li>
            <li>
              <NavLink to="/products/category/3" className={({ isActive }) => isActive ? "text-white bg-gray-800 px-4 py-2 rounded" : "text-gray-600"}>Latte</NavLink>
            </li>
            <li>
              <NavLink to="/products/category/4" className={({ isActive }) => isActive ? "text-white bg-gray-800 px-4 py-2 rounded" : "text-gray-600"}>Americano</NavLink>
            </li>
          </nav>
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
