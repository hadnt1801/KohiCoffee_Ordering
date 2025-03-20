import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Mảng chứa sản phẩm
  paymentInfo: { 
    payment_id: "", 
    method: "", 
    provider: "" 
  }, // Lưu toàn bộ thông tin thanh toán
  now: "",
  customer_id: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ hàng
    addToCart: (state, action) => {
      const { product_id, name, price, img } = action.payload;
      const existingItem = state.items.find((item) => item.product_id === product_id);

      if (existingItem) {
        existingItem.quantity += 1; // Nếu sản phẩm đã có, tăng số lượng
      } else {
        state.items.push({ product_id, name, price, img, quantity: 1 });
      }
    },

    // Xóa một sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.product_id !== action.payload);
    },

    // Thay thế toàn bộ giỏ hàng (chỉ chứa một sản phẩm mới)
    replaceCart: (state, action) => {
      state.items = action.payload.items || [];  // Chỉ thay thế bằng một sản phẩm duy nhất
    },

    // Cập nhật thông tin thanh toán (bao gồm payment_id, method, provider)
    setPayment: (state, action) => {
      state.paymentInfo = {
        payment_id: action.payload.payment_id || "",
        method: action.payload.method || "",
        provider: action.payload.provider || "",
      };
    },

    // Cập nhật thông tin khách hàng
    setCustomer: (state, action) => {
      state.customer_id = action.payload;
    },

    // Đặt lại trạng thái đơn hàng
    setNow: (state, action) => {
      state.now = action.payload;
    },

    // Xóa toàn bộ giỏ hàng và đặt lại dữ liệu
    resetCart: (state) => {
      return initialState; // Trả về trạng thái ban đầu
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
