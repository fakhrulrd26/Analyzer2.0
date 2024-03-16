import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        setOpenModal(true);
      }, 1000 * 60 * 60); // <-- buka pop up informasi selama 30 menit

      return () => clearTimeout(timeoutId);
    }
  }, [user]);

  const userLogout = () => {
    if (logout()) {
      navigation("/");
    }
  };

  const onClickRefreshPage = () => {
    window.location.reload();
  };

  return (
    <div>
      <Modal centered isOpen={openModal}>
        <ModalHeader>Informasi User</ModalHeader>
        <ModalBody>
          Silahkan Lakukan Refresh Page atau klik tombol Refresh dibawah untuk
          mendapatkan access token terbaru
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onClickRefreshPage}>
            Refresh
          </Button>
        </ModalFooter>
      </Modal>

      <Navbar expand={"md"}>
        <NavbarBrand href="/">File Analyzer</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav navbar>
            {user ? (
              <>
                <NavItem>
                  <Link className="nav-link text-dark" to="/check-document">
                    Check Document
                  </Link>
                </NavItem>

                {/* <NavItem>
                  <Link className="nav-link text-dark" to="/feedback">
                    Give Feedback
                  </Link>
                </NavItem> */}

                {/* Tambah Menu User lainnya di sini */}
              </>
            ) : (
              <>
                <NavItem className="me-auto">
                  <Link className="nav-link text-dark" to="/">
                    Home
                  </Link>
                </NavItem>
              </>
            )}
          </Nav>

          {user ? (
            <Dropdown
              isOpen={dropdownOpen}
              toggle={toggleDropdown}
              direction="start"
              className="ms-auto"
            >
              <DropdownToggle color="primary" caret>
                Halo User
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Username: {user.username}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={userLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Nav className="ms-auto" navbar>
              <NavItem>
                <Link className="nav-link text-dark" to="/login">
                  Login
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link text-dark" to="/register">
                  Register
                </Link>
              </NavItem>
            </Nav>
          )}
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
