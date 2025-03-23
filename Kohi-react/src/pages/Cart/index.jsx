import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import loadingImage from '../../assets/images/loading.svg';
import productPlaceholder from '../../assets/images/placeholder-image.webp';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { cartActions } from '../../redux/slices/cart.slice';
import { createTransaction } from '../../utils/dataProvider/transaction';
import useDocumentTitle from '../../utils/documentTitle';
import { n_f } from '../../utils/helpers';

function Cart() {
  const userInfo = useSelector((state) => state.userInfo);
  const cartRedux = useSelector((state) => state.cart);
  const profile = useSelector((state) => state.profile);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product.id");
  const cartItems = cartRedux?.items || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = cartRedux.list;
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({
    payment: "",
    kohiUserName: "",
    kohiPassword: "",
  });
  
  useDocumentTitle("My Cart");

  const handlePaymentChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, payment: value }));
  };

  // useEffect(() => {
  //   if (productId) {
  //     dispatch(cartActions.replaceCart({ id: productId }));
  //   }
  // }, [productId, dispatch]);

   // Mock data cho giỏ hàng
   useEffect(() => {
    const mockProduct = {
      product_id: "1",
      name: "Cà phê sữa",
      price: 25000,
      img: "https://example.com/coffee-milk.jpg",
    };
    dispatch(cartActions.replaceCart({ items: [mockProduct] }));
  }, [dispatch]);

  const handleVerify = () => {
    if (!form.kohiUserName || !form.kohiPassword) {
      toast.error("❌ Vui lòng nhập đầy đủ thông tin đăng nhập.");
      return;
    }
    if (form.kohiUserName === "testuser" && form.kohiPassword === "123456") {
      setIsVerified(true);
      toast.success("✅ Xác thực thành công!");
    } else {
      setIsVerified(false);
      toast.error("❌ Sai thông tin đăng nhập, vui lòng thử lại.");
    }
  };

  function onChangeForm(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const payHandler = () => {
    if (!form.payment || (form.payment === "1" && (!form.kohiUserName || !form.kohiPassword || !isVerified))) {
      return;
    }
    if (editMode) return toast.error("You have unsaved changes");
    // if (!cart || cart.length < 1) return toast.error("Add at least 1 product to your cart");
    
    setIsLoading(true);
  
    // Giả lập giao dịch thành công sau 2 giây
    setTimeout(() => {
      toast.success("Giao dịch thành công!");
      
      // Reset giỏ hàng
      dispatch(cartActions.resetCart());
  
      // Chuyển hướng đến trang thanh toán thành công với mock data
      navigate("/successful", {
        state: {
          orderId: "#123456",
          amount: "500.000đ",
          paymentMethod: "VNPay",
        },
      });
  
      setIsLoading(false);
    }, 2000);
  };
  


  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
        <div className="bg-white max-w-4xl w-full rounded-lg shadow-md p-6">
          <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Đơn hàng</h2>
          {cartItems.length > 0 ? (
            <div className="flex items-center gap-4 border-b pb-4">
              <img src={isEmpty(cartItems[0]?.img) ? productPlaceholder : cartItems[0]?.img} alt="Product" className="w-20 h-20 object-cover rounded-lg" />
              <div>
                <p className="font-semibold">{cartItems[0]?.name}</p>
                <p className="text-lg text-gray-700">{n_f(cartItems[0]?.price)} VND</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-lg font-bold text-gray-500">Giỏ hàng trống</p>
          )}
          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Total:</span>
            <span>{cartItems.length > 0 ? `${n_f(cartItems[0]?.price)} VND` : "0 VND"}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-700 mt-6">Phương thức thanh toán</h2>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="1" checked={form.payment === "1"} onChange={handlePaymentChange} disabled={cartItems.length === 0} /> Ví KOHI
            </label>
            {form.payment === "1" && cartItems.length > 0 && (
              <div className="space-y-2">
                <input type="text" placeholder="User Name" className="w-full p-2 border rounded" name="kohiUserName" value={form.kohiUserName} onChange={onChangeForm} />
                <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full p-2 border rounded" name="kohiPassword" value={form.kohiPassword} onChange={onChangeForm} />
                <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={handleVerify} disabled={!form.kohiUserName || !form.kohiPassword}>Xác thực</button>
                {isVerified && <p className="text-green-600 font-bold">✅ Đã xác thực!</p>}
              </div>
            )}
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="2" checked={form.payment === "2"} onChange={handlePaymentChange} disabled={cartItems.length === 0} /> Bank account
            </label>
          </div>
          <button onClick={payHandler} className="mt-6 w-full bg-green-500 text-white p-3 rounded font-bold disabled:bg-gray-400"
              disabled={!form.payment || cartItems.length === 0 || (form.payment === "1" && (!form.kohiUserName || !form.kohiPassword || !isVerified))}>
              Xác nhận & Thanh toán
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Cart;
