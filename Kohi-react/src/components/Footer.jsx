import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import logo from '../assets/logocoffee.png';

class Footer extends Component {
  render() {
    return (
      <footer className="bg-[#F8F8F8] text-[#4f5665]">
        <div className="global-px">
          <div className="py-5 md:py-10"></div>
          <div className="flex flex-col-reverse gap-12 md:flex-row items-center justify-between">
            <div className="flex flex-col gap-4 md:flex-[2_2_0%] items-center text-center">
              <Link to="/">
                <div className="font-extrabold flex flex-row gap-2 items-center">
                  <img src={logo} alt="logo" width="50px" />
                  <h1 className="text-xl text-black">KohiCoffee</h1>
                </div>
              </Link>
              <div>
                KohiCoffee - Đặt hàng nhanh chóng, pha chế tự động, phục vụ hoàn hảo!
              </div>
              <div className="copyright">&copy; 2025 KohiCoffee. Tất cả quyền được bảo lưu.</div>
            </div>
          </div>
          <div className="py-5"></div>
        </div>
      </footer>
    );
  }
}

export default Footer;
