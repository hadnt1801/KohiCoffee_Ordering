import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, amount, paymentMethod } = location.state || {
    orderId: 0,
    amount: "0đ",
    paymentMethod: "Chưa xác định",
  };

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Bắt đầu đếm ngược để chuyển trang
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/process");
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Thanh toán thành công!
          </h2>
          <p className="text-gray-600 mt-2">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
          </p>

          <div className="mt-6 text-left">
            <p className="text-gray-700 font-medium">
              Mã đơn hàng: <span className="font-semibold">{orderId}</span>
            </p>
            <p className="text-gray-700 font-medium">
              Số tiền: <span className="font-semibold">{amount}</span>
            </p>
            <p className="text-gray-700 font-medium">
              Phương thức: <span className="font-semibold">{paymentMethod}</span>
            </p>
          </div>

          <p className="mt-6 text-gray-500 text-sm">
            Tự động chuyển trang sau <span className="font-bold">{countdown}</span> giây...
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
