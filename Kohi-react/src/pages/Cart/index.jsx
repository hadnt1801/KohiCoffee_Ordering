import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {axiosInstance} from "../../axios/Axios"; // Import Axios instance
import loadingImage from "../../assets/images/loading.svg";
import productPlaceholder from "../../assets/images/placeholder-image.webp";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { cartActions } from "../../redux/slices/cart.slice";
import useDocumentTitle from "../../utils/documentTitle";
import { n_f } from "../../utils/helpers";
import { FaTrash } from "react-icons/fa";

function Cart() {
  const cartRedux = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [product, setProduct] = useState(null);

  const [form, setForm] = useState({
    payment: "",
    kohiUserName: "",
    kohiPassword: "",
  });

  useDocumentTitle("My Cart");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        setIsLoading(true);
        const response = await fetch(`https://coffeeshop.ngrok.app/api/products/${productId}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
          dispatch(cartActions.replaceCart({ items: [data] }));
        } else {
          toast.error("Không thể tải dữ liệu sản phẩm");
        }
      } catch (error) {
        toast.error("Lỗi khi lấy dữ liệu sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [dispatch, productId]);

  const handlePaymentChange = (e) => {
    setForm((prev) => ({ ...prev, payment: e.target.value }));
  };

  const handleVerify = () => {
    if (!form.kohiUserName || !form.kohiPassword) {
      toast.error("❌ Vui lòng nhập đầy đủ thông tin đăng nhập.");
      return;
    }
    if (form.kohiUserName === "test@example.com" && form.kohiPassword === "123456") {
      setIsVerified(true);
      toast.success("✅ Xác thực thành công!");
    } else {
      setIsVerified(false);
      toast.error("❌ Sai thông tin đăng nhập, vui lòng thử lại.");
    }
  };

  const onChangeForm = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const handleCreateOrder = async (

  // ) => {
  //   try {
  //     const payload = {
  //       OrderDate: new Date().toISOString(),
  //       OrderCode: `ORD-${Date.now()}`,
  //       OrderDescription: "Thanh toán đơn hàng tại máy",
  //       TotalAmount: parseFloat(product?.price || 0),
  //       Status: 0, // Chưa xác nhận
  //       CustomerId: 0, // Cần thay đổi theo user thực tế
  //       MachineId: 1,  // Cần thay đổi theo dữ liệu thực tế
  //     };

  //     await axiosInstance.post("https://coffeeshop.ngrok.app/api/orders", payload);
  //     toast.success("Đặt hàng thành công!");
  //     return true;
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Đã có lỗi khi đặt hàng!");
  //     return false;
  //   }
  // };

  const payHandler = async () => {
    if (!form.payment || (form.payment === "1" && (!form.kohiUserName || !form.kohiPassword || !isVerified))) {
      return;
    }
  
    setIsLoading(true);
  
    try {
      // 🛒 **Bước 1: Tạo đơn hàng**
      const orderPayload = {
        OrderDate: new Date().toISOString(),
        OrderCode: `ORD-${Date.now()}`,
        OrderDescription: "Thanh toán đơn hàng tại máy",
        TotalAmount: parseFloat(product?.price || 0),
        Status: 0, // Chưa xác nhận
        CustomerId: 0, // Cần thay đổi theo user thực tế
        MachineId: 1,  // Cần thay đổi theo dữ liệu thực tế
      };
  
      const orderResponse = await axiosInstance.post("https://coffeeshop.ngrok.app/api/orders", orderPayload);
      if (!orderResponse.data || !orderResponse.data.orderId) {
        throw new Error("Không thể tạo đơn hàng");
      }
  
      const orderId = orderResponse.data.orderId; // 📌 Lấy orderId từ API đơn hàng
  
      // 💳 **Bước 2: Gửi thanh toán**
      let paymentResponse;
      if (form.payment === "1") {
        // Thanh toán qua Ví KOHI
        paymentResponse = await axiosInstance.post("https://coffeeshop.ngrok.app/api/payments/wallet", {
          orderId,
        });
      } else {
        // Thanh toán qua VNPay
        paymentResponse = await axiosInstance.post("https://coffeeshop.ngrok.app/api/payments/vnpay", {
          orderId,
          amount: parseFloat(product?.price || 0),
        });
        
      }
  
      if (paymentResponse.status === 200) {
        toast.success("Giao dịch thành công!");
        dispatch(cartActions.resetCart());
        
        // 🔄 **Bước 3: Chuyển hướng sang trang thành công**
        navigate("/successful", {
          state: {
            orderId: `#${orderId}`,
            amount: `${n_f(product?.price)} VND`,
            paymentMethod: form.payment === "1" ? "Ví KOHI" : "Bank account",
            orderDescription: product?.productName,
            customerId: 1,
            machineId: 1,
          },
        });
      } else {
        throw new Error("Thanh toán thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thanh toán!");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleRemoveProduct = () => {
    navigate("/products?q=all");
  };

  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
        <div className="bg-white max-w-4xl w-full rounded-lg shadow-md p-6">
          <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Đơn hàng</h2>
          {isLoading ? (
            <img src={loadingImage} alt="Loading" className="mx-auto" />
          ) : product ? (
            <div className="flex items-center gap-4 border-b pb-4 justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={product.path ? `https://coffeeshop.ngrok.app/api/products/image${product.path}` : productPlaceholder}
                  alt={product.productName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold">{product?.productName}</p>
                  <p className="text-lg text-gray-700">{n_f(product?.price)} VND</p>
                </div>
              </div>
              <button onClick={handleRemoveProduct} className="text-red-500 text-xl">
                <FaTrash />
              </button>
            </div>
          ) : (
            <p className="text-center text-lg font-bold text-gray-500">Không có sản phẩm</p>
          )}

          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Total:</span>
            <span>{product ? `${n_f(product?.price)} VND` : "0 VND"}</span>
          </div>

          <h2 className="text-xl font-bold text-gray-700 mt-6">Phương thức thanh toán</h2>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="1" checked={form.payment === "1"} onChange={handlePaymentChange} disabled={!product} /> Ví KOHI
            </label>
            {form.payment === "1" && product && (
              <div className="space-y-2">
                <input type="text" placeholder="User Name" className="w-full p-2 border rounded" name="kohiUserName" value={form.kohiUserName} onChange={onChangeForm} />
                <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full p-2 border rounded" name="kohiPassword" value={form.kohiPassword} onChange={onChangeForm} />
                <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={handleVerify}>Xác thực</button>
                {isVerified && <p className="text-green-600 font-bold">✅ Đã xác thực!</p>}
              </div>
            )}
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="2" checked={form.payment === "2"} onChange={handlePaymentChange} disabled={!product} /> Bank account
            </label>
          </div>

          <button onClick={payHandler} className="mt-6 w-full bg-green-500 text-white p-3 rounded font-bold disabled:bg-gray-400" disabled={!form.payment || !product || (form.payment === "1" && !isVerified)}>
            Xác nhận & Thanh toán
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Cart;
