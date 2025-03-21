import React, { Component, useContext } from "react";

import _ from "lodash";
import { toast } from "react-hot-toast";
import { connect } from "react-redux";
import {
  createSearchParams,
  Link,
  Navigate,
  NavLink,
  useNavigate,
} from "react-router-dom";

import burgerIcon from "../assets/icons/burger-menu-left.svg";
import chatIcon from "../assets/icons/chat.svg";
import placeholderProfile from "../assets/images/placeholder-profile.jpg";
import logo from "../assets/kohicoffee.png";
import { contextAct } from "../redux/slices/context.slice";
import { profileAction } from "../redux/slices/profile.slice";
import { uinfoAct } from "../redux/slices/userInfo.slice";
import { getUserData, isAuthenticated } from "../utils/authUtils";
import withSearchParams from "../utils/wrappers/withSearchParams.js";
import Logout from "./Logout";
import Sidebar from "./Sidebar";

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  profile: state.profile,
});

const mapDispatchToProps = (dispatch) => ({
  assignToken: () => dispatch(uinfoAct.assignToken()),
  dismissToken: () => dispatch(uinfoAct.dismissToken()),
  getProfile: (token, controller) =>
    dispatch(profileAction.getProfileThunk({ token, controller })),
  openLogout: () => dispatch(contextAct.openLogout()),
});

// // create a navigation component that wraps the burger menu
// const Navigation = () => {
//   const ctx = useContext(MyContext);

//   return (
//     <Sidebar
//       customBurgerIcon={false}
//       isOpen={ctx.isMenuOpen}
//       onStateChange={(state) => ctx.stateChangeHandler(state)}
//     />
//   );
// };

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isNavbarOpen: false,
      redirectLogout: false,
      isSearchOpen: false,
      inputSearch: "",
    };
    this.dropdownRef = React.createRef();
    this.searchRef = React.createRef();
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleClickOutsideSearch = this.handleClickOutsideSearch.bind(this);
  }
  navigateTo(path) {
    const navigate = useNavigate();
    navigate(path);
  }

  componentDidMount() {
    const query = this.props.searchParams.get("q");
    // console.log(query);
    // if (query) {
    this.setState((prevState) => ({
      ...prevState,
      inputSearch: query || "",
    }));
    // }
    document.addEventListener("click", this.handleClickOutside);
    document.addEventListener("click", this.handleClickOutsideSearch);
    // console.log(jwtDecode(this.props.userInfo.token));
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  toggleDropdown() {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  }

  toggleNavbar = () => {
    this.setState((prevState) => ({
      isNavbarOpen: !prevState.isNavbarOpen,
    }));
  };

  limitCharacters(str) {
    if (str.length > 20) {
      return str.substring(0, 20) + "...";
    }
    return str;
  }

  logoutHandler = () => {
    toast.dismiss();
    this.props.openLogout();
    // toast.promise(
    //   logoutUser(this.props.userInfo.token).then((res) => {
    //     return res.data;
    //   }),
    //   {
    //     loading: "Please wait",
    //     success: () => {
    //       this.setState({ ...this.state, redirectLogout: true });
    //       this.props.dismissToken();
    //       return "Logout has been successful! See ya!";
    //     },
    //     error: (err) => {
    //       console.log(err);
    //       return "Something went wrong, please reload your page!";
    //     },
    //   }
    // );
  };

  handleClickOutside(event) {
    if (
      this.dropdownRef.current &&
      !this.dropdownRef.current.contains(event.target)
    ) {
      this.setState({
        isDropdownOpen: false,
      });
    }
  }

  handleClickOutsideSearch(event) {
    if (
      this.searchRef.current &&
      !this.searchRef.current.contains(event.target)
    ) {
      this.setState({
        isSearchOpen: false,
      });
    }
  }

  render() {
    return (
      <>
        <Logout />
        <div
          className={`${
            this.state.isNavbarOpen ? "translate-x-0" : "translate-x-full"
          } fixed top-0 left-0 w-full h-full bg-black opacity-50 z-[45] transition-opacity duration-300 ease-in-out`}
          onClick={this.toggleNavbar}
        ></div>
        <div
          className={`${
            this.state.isNavbarOpen ? "translate-x-0" : "translate-x-full"
          } transform h-full w-80 bg-white fixed top-0 right-0 z-[60] transition-transform duration-300 ease-in-out`}
        >
          <Sidebar onClose={this.toggleNavbar} />
        </div>
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b-2 border-gray-100">
          <div className="flex global-px justify-between items-center">
            <div className="flex-1 flex justify-center py-2 md:py-3">
              <Link to="/products?q=all" className="flex flex-row items-center gap-4">
                <img src={logo} alt="logo" className="w-48 md:w-56" />
              </Link>
            </div>
            <div className="navbar-burger select-none cursor-pointer lg:hidden py-4 flex gap-7 items-center">
              <div ref={this.searchRef} className="search-section cursor-pointer relative"
                onClick={() => this.setState({ isSearchOpen: !this.state.isSearchOpen })}
              >
                <svg width="26" height="26" viewBox="0 0 17 17" fill="none">
                  <path d="M16 16L12.375 12.375M14.3333 7.66667C14.3333 11.3486 11.3486 14.3333 7.66667 14.3333C3.98477 14.3333 1 11.3486 1 7.66667C1 3.98477 3.98477 1 7.66667 1C11.3486 1 14.3333 3.98477 14.3333 7.66667Z"
                    stroke="#4F5665" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <button onClick={this.toggleNavbar}>
                <img src={burgerIcon} width="32px" className="aspect-square" alt="" />
              </button>
            </div>
          </div>
        </header>
      </>
    );
  }
}

export default withSearchParams(
  connect(mapStateToProps, mapDispatchToProps)(Header)
);
