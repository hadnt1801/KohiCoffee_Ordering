import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { isEmpty } from 'lodash';
import { toast } from 'react-hot-toast';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate, useSearchParams  } from 'react-router-dom';

import loadingImage from '../../assets/images/loading.svg';
import productPlaceholder from '../../assets/images/placeholder-image.webp';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import { cartActions } from '../../redux/slices/cart.slice';
import { createTransaction } from '../../utils/dataProvider/transaction';
import useDocumentTitle from '../../utils/documentTitle';
import { n_f } from '../../utils/helpers';


function Cart() {
  const userInfo = useSelector((state) => state.userInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // const [cart, setCart] = useState([]);
  const cartRedux = useSelector((state) => state.cart);
  const profile = useSelector((state) => state.profile);
  
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product.id"); // Lấy productId từ URL
  const cartadd = useSelector((state) => state.cart); // Lấy dữ liệu giỏ hàng từ Redux
  console.log("cartadd:", cartadd); // Kiểm tra dữ liệu giỏ hàng
  console.log("cartItems:", cartadd.items); // Phải luôn là một mảng []
  const cartItems = cartadd?.items || []; // Đảm bảo không bị undefined
  console.log("cartItems:", cartItems);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = cartRedux.list;
  // const [result, setResult] = useState("");

  const [form, setForm] = useState({
    payment: "",  // Mặc định chưa chọn phương thức thanh toán
    kohiUserName: "",
    kohiPassword: "",
  });

  const [selectedPayment, setSelectedPayment] = useState(form.payment);
  const [showPassword, setShowPassword] = useState(false);

  const handlePaymentChange = (e) => {
    const value = e.target.value;
    setSelectedPayment(value);
    onChangeForm(e); // Gọi hàm cập nhật form
  };

  useEffect(() => {
    if (productId) {
      const selectedProduct = {
        id: productId,
        // quantity: 1, // Chỉ chọn 1 sản phẩm
      };

      // Thay thế sản phẩm cũ bằng sản phẩm mới
      dispatch(cartActions.replaceCart(selectedProduct));
    }
  }, [productId, dispatch]);

  //xác thực ví KohiKohi
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    if (form.kohiUserName === "testuser" && form.kohiPassword === "123456") {
      setIsVerified(true);
      alert("✅ Xác thực thành công!");
    } else {
      setIsVerified(false);
      alert("❌ Sai thông tin đăng nhập, vui lòng thử lại.");
    }
  };

  // const [form, setForm] = useState({
  //   payment: "",
  //   delivery_address: "",
  //   notes: "",
  //   phone_number: "",
  // });
  useDocumentTitle("My Cart");

  
  function onChangeForm(e) {
    return setForm((form) => {
      return {
        ...form,
        [e.target.name]: e.target.value,
      };
    });
  }

  useEffect(() => {
    if (profile.isFulfilled) {
      setForm({
        ...form,
        phone_number: profile.data?.phone_number,
        delivery_address: profile.data?.address,
      });
    }
    // setIsLoading(true);
    //   getCart(userInfo.token)
    //     .then((res) => {
    //       setCart(res.data.data);
    //       setIsLoading(false);
    //     })
    //     .catch((err) => {
    //       setIsLoading(false);
    //       toast.error("Failed to fetch data");
    //     });
  }, [profile]);

  const Loading = (props) => {
    return (
      <section className="min-h-[80vh] flex items-center justify-center flex-col">
        <div>
          <img src={loadingImage} alt="" />
        </div>
      </section>
    );
  };

  const toggleEdit = () => setEditMode(!editMode);
  const saveEditInfo = () => {
    toggleEdit();
  };

  const disabled = form.payment === "" || form.delivery_address === "";
  const controller = useMemo(() => new AbortController());
  const payHandler = () => {
    if (disabled) return;
    // if (userInfo.token === "") {
    //   toast.error("Login to continue transaction");
    //   navigate("/auth/login");
    //   return;
    // }
    if (editMode) return toast.error("You have unsaved changes");
    if (cart.length < 1)
      return toast.error("Add at least 1 product to your cart");
    setIsLoading(true);
    createTransaction(
      {
        payment_id: form.payment,
        delivery_id: 1,
        address: form.delivery_address,
        notes: form.notes,
      },
      cart,
      userInfo.token,
      controller
    )
      .then(() => {
        toast.success("Success create transaction");
        dispatch(cartActions.resetCart());
        navigate("/history");
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error ocurred, please check your internet connection");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const closeRemoveModal = () => {
    setRemove({ product_id: "", size_id: "" });
  };
  return (
    <>
      {/* <Modal
        isOpen={remove.product_id !== "" && remove.size_id !== ""}
        onClose={() => setRemove({ product_id: "", size_id: "" })}
        className="flex flex-col gap-y-5"
      >
        Are you sure to delete this item form your cart?
        <div className="mx-auto space-x-3">
          <button
            onClick={() => {
              dispatch(
                cartActions.removeFromCart({
                  product_id: remove.product_id,
                  size_id: remove.size_id,
                })
              );
              setRemove({ product_id: "", size_id: "" });
            }}
            className="btn btn-primary text-white"
          >
            Yes
          </button>
          <div onClick={closeRemoveModal} className="btn btn-error">
            No
          </div>
        </div>
      </Modal> */}
      <Header />

      <main className="bg-cart bg-cover bg-center">
        <div className="global-px  space-y-3 py-10">
          {/* <section className="text-white lg:text-3xl text-2xl font-extrabold drop-shadow-lg text-center md:text-left">
            Checkout your item now!
          </section> */}
          <section className="flex flex-col md:flex-row lg:gap-16 gap-10">
            <aside className="flex-1 flex">
              <section className="flex bg-white rounded-lg p-5 lg:p-7 flex-col w-full">
                <div className="w-full my-4 lg:my-6">
                  <p className="text-tertiary font-bold text-xl lg:text-3xl text-center">
                    Đơn hàng
                  </p>
                </div>
                
                <section className="flex w-full flex-col gap-4 my-4">
                  {cartItems.length > 0 ? (
                    <div className="flex flex-row gap-2 lg:gap-5 w-full lg:text-lg items-center relative">
                      <aside className="flex-1">
                        <img
                          src={isEmpty(cartItems[0]?.img) ? productPlaceholder : cartItems[0]?.img}
                          alt={cartItems[0]?.name || "Product Image"}
                          className="aspect-square h-auto object-cover rounded-xl"
                        />
                      </aside>
                      <aside className="flex-[2_2_0%]">
                        <p className="font-semibold">{cartItems[0]?.name}</p>
                        <p className="text-lg">{n_f(cartItems[0]?.price)} VND</p>
                      </aside>
                      <aside className="flex-1">
                        <button
                          onClick={() => setRemove({ product_id: cartItems[0]?.product_id })}
                          className="absolute top-2 right-2 rounded-full h-6 w-6 bg-tertiary text-white font-bold text-xs text-center flex"
                        >
                          <p className="m-auto">X</p>
                        </button>
                      </aside>
                    </div>
                  ) : (
                    <p className="text-center text-lg font-bold">Giỏ hàng trống</p>
                  )}
                </section>

                <hr />

                <section className="flex flex-col w-full my-4">
                  <div className="flex flex-row uppercase lg:text-lg">
                    <p className="flex-[2_2_0%]">Subtotal</p>
                    <p className="flex-1 lg:flex-none text-right">
                      {cartItems.length > 0 ? `${n_f(cartItems[0]?.price)} VND` : "0 VND"}
                    </p>
                  </div>

                  <div className="flex flex-row uppercase lg:text-xl font-bold my-10">
                    <p className="flex-[2_2_0%]">Total</p>
                    <p className="flex-initial lg:flex-none">
                      {cartItems.length > 0 ? `${n_f(cartItems[0]?.price)} VND` : "0 VND"}
                    </p>
                  </div>
                </section>
              </section>
            </aside>

            <aside className="flex-1 flex flex-col gap-5">
              <section className="text-white text-xl lg:text-2xl font-extrabold drop-shadow-lg text-center md:text-left relative">
                Phương thức thanh toán
              </section>
              <section className="bg-white rounded-xl p-5 lg:p-7 space-y-3">
                {/* Ví KOHI */}
                <div className="flex gap-2 items-center">
                  <input
                    type="radio"
                    className="accent-tertiary w-4 h-4"
                    name="payment"
                    value="1"
                    id="paymentCard"
                    checked={selectedPayment === "1"}
                    onChange={handlePaymentChange}
                  />
                  <label htmlFor="paymentCard" className="flex items-center gap-2">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect width="40" height="40" rx="10" fill="#F47B0A" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13 15C13 14.4696 13.2107 13.9609 13.5858 13.5858C13.9609 13.2107 14.4696 13 15 13H27C27.5304 13 28.0391 13.2107 28.4142 13.5858C28.7893 13.9609 29 14.4696 29 15V23C29 23.5304 28.7893 24.0391 28.4142 24.4142C28.0391 24.7893 27.5304 25 27 25H15C14.4696 25 13.9609 24.7893 13.5858 24.4142C13.2107 24.0391 13 23.5304 13 23V15Z"
                        fill="white"
                      />
                    </svg>
                    Ví KOHI
                  </label>
                </div>

                {/* Hiển thị form nhập khi chọn Ví KOHI */}
                {selectedPayment === "1" && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="User Name"
                      className="w-full p-2 border rounded-md"
                      name="kohiUserName"
                      value={form.kohiUserName || ""}
                      onChange={onChangeForm}
                    />
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full p-2 border rounded-md pr-10"
                        name="kohiPassword"
                        value={form.kohiPassword || ""}
                        onChange={onChangeForm}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"} 
                      </button>
                    </div>

                    {/* Nút xác thực */}
                    <button
                      className="w-full bg-blue-500 text-white p-2 rounded-md"
                      onClick={handleVerify}
                    >
                      Xác thực
                    </button>

                    {/* Hiển thị trạng thái xác thực */}
                    {isVerified && <p className="text-green-600 font-bold">✅ Đã xác thực!</p>}
                  </div>
                )}

                <hr />

                {/* Bank Account */}
                <div className="flex gap-2 items-center">
                  <input
                    type="radio"
                    className="accent-tertiary w-4 h-4"
                    name="payment"
                    value="2"
                    id="paymentBank"
                    checked={selectedPayment === "2"}
                    onChange={handlePaymentChange}
                  />
                  <label htmlFor="paymentBank" className="flex items-center gap-2">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect width="40" height="40" rx="10" fill="#895537" />
                      <path
                        d="M20 11L13 15V16H27V15L20 11ZM15 17L14.8 24H17.3L17 17H15ZM19 17L18.8 24H21.3L21 17H19ZM23 17L22.8 24H25.3L25 17H23ZM13 27H27V25H13V27Z"
                        fill="white"
                      />
                    </svg>
                    Bank account
                  </label>
                </div>
              </section>
              <button
                disabled={
                  !form.payment || 
                  (form.payment === "1" && (!form.kohiUserName || !form.kohiPassword || !isVerified))
                }
                onClick={payHandler}
                className={`${
                  isLoading && "loading"
                } btn btn-block btn-primary text-white py-4 font-bold rounded-lg disabled:bg-opacity-100`}
              >
                Confirm and Pay
              </button>

            </aside>
          </section>
        </div>
      </main>
    <Footer />
    </>
  );
}

export default Cart;
