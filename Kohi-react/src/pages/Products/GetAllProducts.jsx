import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useParams } from "react-router-dom";

import penIcon from "../../assets/icons/icon-pen.svg";
import productPlaceholder from "../../assets/images/placeholder-image.webp";
import { n_f } from "../../utils/helpers";
import withSearchParams from "../../utils/wrappers/withSearchParams.js";

function GetAllProducts({ categoryId }) {
  const [products, setProducts] = useState([]);
  const userInfo = useSelector((state) => state.userInfo);
  const { catId } = useParams();

  const mockProducts = [
    { id: 1, name: "Cà phê sữa", price: 30000, img: productPlaceholder, category: "1" },
    { id: 2, name: "Cà phê đen", price: 25000, img: productPlaceholder, category: "1" },
    { id: 3, name: "Trà sữa", price: 35000, img: productPlaceholder, category: "2" },
    { id: 4, name: "Matcha", price: 40000, img: productPlaceholder, category: "2" },
    { id: 5, name: "Cappuccino", price: 45000, img: productPlaceholder, category: "1" },
    { id: 6, name: "Espresso", price: 50000, img: productPlaceholder, category: "1" },
    { id: 7, name: "Latte", price: 48000, img: productPlaceholder, category: "1" },
    { id: 8, name: "Macchiato", price: 52000, img: productPlaceholder, category: "1" },
    { id: 9, name: "Bánh ngọt", price: 25000, img: productPlaceholder, category: "3" },
    { id: 10, name: "Add-on sữa", price: 10000, img: productPlaceholder, category: "4" }
  ];

  useEffect(() => {
    if (catId) {
      setProducts(mockProducts.filter((product) => product.category === catId));
    } else {
      setProducts(mockProducts);
    }
  }, [catId]);

  return (
    <>
      <section className="grid grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 justify-items-center content-around gap-3 gap-y-16 mt-10">
        {products.map((product) => (
          <Link to={`/products/detail/${product.id}`} key={product.id}>
            <section className="relative w-36 bg-white shadow-lg hover:shadow-xl duration-200 p-5 rounded-3xl">
              <img
                src={product.img ?? productPlaceholder}
                alt=""
                className="aspect-square rounded-full object-cover mt-[-50%] w-full mb-3 shadow-lg"
              />
              <div className="flex flex-col gap-5 content-between text-center">
                <p className="font-black text-lg min-h-[102px]">{product.name}</p>
                <p className="font-bold end text-tertiary">IDR {n_f(product.price)}</p>
                {Number(userInfo.role) > 1 && (
                  <NavLink
                    to={`/products/edit/${product.id}`}
                    className="bg-tertiary absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary-focus"
                  >
                    <img src={penIcon} className="w-4 h-4" />
                  </NavLink>
                )}
              </div>
            </section>
          </Link>
        ))}
      </section>
    </>
  );
}

export default withSearchParams(GetAllProducts);
