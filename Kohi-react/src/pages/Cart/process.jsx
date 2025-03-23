import React, { useEffect, useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const ProcessingOrders = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState({ id: 1, product: "Cà phê sữa", status: "processing" });
  const [timeoutId, setTimeoutId] = useState(null);
  const [countdown, setCountdown] = useState(120); // 120 giây (2 phút)

  useEffect(() => {
    const interval = setInterval(() => {
      setOrder((prevOrder) =>
        prevOrder.status === "processing"
          ? { ...prevOrder, status: Math.random() > 0.5 ? "completed" : "processing" }
          : prevOrder
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    let countdownInterval;

    if (order.status === "completed") {
      // Bắt đầu đếm ngược
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Chuyển hướng sau 90 giây
      timer = setTimeout(() => navigate("/"), 90000);
      setTimeoutId(timer);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [order.status, navigate]);

  const handleBackHome = () => {
    if (timeoutId) clearTimeout(timeoutId);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="text-xl font-bold">Đơn hàng đang xử lý</h1>
        <div className="border border-gray-300 rounded-lg p-6 mt-4 w-80 text-center">
          <div>
            <p className="text-lg font-semibold">{order.product}</p>
            <p className="text-gray-500 text-sm">Mã đơn: #{order.id}</p>
          </div>

          {order.status === "processing" ? (
            <div className="flex items-center justify-center text-orange-500 mt-2">
              <Clock className="w-5 h-5" />
              <span className="ml-2">Đang xử lý...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center text-green-500 mt-2">
              <CheckCircle className="w-5 h-5" />
              <span className="ml-2">Hoàn thành</span>
            </div>
          )}
        </div>

        {order.status === "completed" && (
          <div className="mt-6 flex flex-col items-center">
            <button
              onClick={handleBackHome}
              className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600 transition"
            >
              Quay về trang chủ
            </button>
            <p className="text-gray-500 text-xs mt-2">
              Tự động quay về trang chủ sau <span className="font-semibold">{countdown}</span> giây...
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProcessingOrders;
