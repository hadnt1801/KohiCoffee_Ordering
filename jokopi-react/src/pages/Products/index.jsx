import "react-loading-skeleton/dist/skeleton.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const [sort, setSort] = useState(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(
    searchParams.has("q") ? searchParams.get("q") : undefined
  );
  const navigate = useNavigate();

  const navigateWithParams = (newParams) => {
    const searchParams = new URLSearchParams(location.search);
    Object.entries(newParams).forEach(([key, value]) =>
      searchParams.set(key, value)
    );
    navigate(`${location.pathname}?${searchParams}`);
  };

  const delayedSearch = useCallback(
    _.debounce((q) => {
      navigateWithParams({ q });
    }, 1500),
    []
  );

  useEffect(() => {
    if (search) {
      delayedSearch(search);
    }
  }, [search]);

  useDocumentTitle(props.title);
  return (
    <>
      <Header />
      <main className="flex flex-col md:flex-row global-px">
        <section className="flex-[2_2_0%] flex flex-col md:pl-16 py-5">
          <nav className="list-none flex flex-row md:justify-between justify-evenly flex-wrap gap-5 mb-10 ">
            <li>
              <NavLink to="/products" end className={({ isActive }) => isActive ? "text-white bg-gray-800 px-4 py-2 rounded" : "text-gray-600"}>All</NavLink>
            </li>
            <li>
              <NavLink to="category/1" className={({ isActive }) => isActive ? "text-white bg-gray-800 px-4 py-2 rounded" : "text-gray-600"}>Coffee</NavLink>
            </li>
            <li>
              <NavLink to="category/2" className={({ isActive }) => isActive ? "text-white bg-gray-800 px-4 py-2 rounded" : "text-gray-600"}>Non Coffee</NavLink>
            </li>
            <li>
              <NavLink to="category/3" className={({ isActive }) => isActive ? "text-white bg-gray-800 px-4 py-2 rounded" : "text-gray-600"}>Foods</NavLink>
            </li>
            <li>
              <NavLink to="category/4" className={({ isActive }) => isActive ? "text-white bg-gray-800 px-4 py-2 rounded" : "text-gray-600"}>Add-on</NavLink>
            </li>
          </nav>
          <Routes path="/products/*">
            <Route
              index
              element={<GetAllProducts />}
            ></Route>
            <Route
              path="category/:catId"
              element={<GetAllProducts />}
            />
          </Routes>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Products;
