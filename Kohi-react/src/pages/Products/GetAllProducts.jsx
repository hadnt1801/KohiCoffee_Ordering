import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import productPlaceholder from "../../assets/images/placeholder-image.webp";
import { n_f } from "../../utils/helpers";
import withSearchParams from "../../utils/wrappers/withSearchParams.js";

function GetAllProducts({ categoryId }) {
  const [products, setProducts] = useState([]);
  const { catId } = useParams();

  const mockProducts = [
    { id: 1, name: "Espresso", price: 50000, img: productPlaceholder, category: "1", description: "Một tách cà phê đậm đà với hương vị nguyên bản." },
    { id: 2, name: "Doppio", price: 55000, img: productPlaceholder, category: "1", description: "Gấp đôi lượng Espresso cho những ai thích sự mạnh mẽ." },
    { id: 3, name: "Ristretto", price: 52000, img: productPlaceholder, category: "1", description: "Espresso cô đặc với hương vị đậm đà hơn." },
    { id: 4, name: "Lungo", price: 53000, img: productPlaceholder, category: "1", description: "Espresso pha loãng hơn để có vị dịu nhẹ." },
    { id: 5, name: "Cappuccino", price: 45000, img: productPlaceholder, category: "2", description: "Cà phê với lớp sữa bọt mịn màng." },
    { id: 6, name: "Dry Cappuccino", price: 46000, img: productPlaceholder, category: "2", description: "Cappuccino ít sữa, nhiều bọt hơn." },
    { id: 7, name: "Iced Cappuccino", price: 47000, img: productPlaceholder, category: "2", description: "Cappuccino ướp lạnh, thích hợp cho ngày nóng." },
    { id: 8, name: "Latte", price: 48000, img: productPlaceholder, category: "3", description: "Cà phê sữa mịn màng với lớp sữa hấp dẫn." },
    { id: 9, name: "Caramel Latte", price: 49000, img: productPlaceholder, category: "3", description: "Latte thơm ngon với caramel ngọt ngào." },
    { id: 10, name: "Mocha Latte", price: 51000, img: productPlaceholder, category: "3", description: "Latte hòa quyện với hương vị sô-cô-la." },
    { id: 11, name: "Americano", price: 40000, img: productPlaceholder, category: "4", description: "Cà phê đen pha loãng, nhẹ nhàng hơn Espresso." },
    { id: 12, name: "Iced Americano", price: 42000, img: productPlaceholder, category: "4", description: "Americano ướp lạnh, sảng khoái." },
    { id: 13, name: "Long Black", price: 45000, img: productPlaceholder, category: "4", description: "Giống Americano nhưng có sự khác biệt nhẹ trong pha chế." }
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
          <Link to={`/cart?productId=${product.id}`} key={product.id}>
            <section className="relative w-36 bg-white shadow-lg hover:shadow-xl duration-200 p-5 rounded-3xl">
              <img
                src={product.img ?? productPlaceholder}
                alt=""
                className="aspect-square rounded-full object-cover mt-[-50%] w-full mb-3 shadow-lg"
              />
              <div className="flex flex-col gap-5 content-between text-center">
                <p className="font-black text-lg min-h-[102px]">{product.name}</p>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="font-bold end text-tertiary">{n_f(product.price)} VND</p>
              </div>
            </section>
          </Link>
        ))}
      </section>
    </>
  );
}

export default withSearchParams(GetAllProducts);
