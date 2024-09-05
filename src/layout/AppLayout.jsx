import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./AppLayout.css";

const AppLayout = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const goToHome = () => {
    navigate("/");
  };

  const searchByKeyword = (e) => {
    e.preventDefault();
    navigate(`/movies?q=${keyword}`);
    setKeyword("");
  };
  return (
    <div className="AppLayout">
      <Navbar
        bg="dark"
        data-bs-theme="dark"
        expand="md"
        className="bg-body-tertiary custom-navBar"
      >
        <Container>
          <Navbar.Brand>
            <img
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="Logo"
              width="100"
              height="30"
              className="d-inline-block align-top logo-img"
              onClick={goToHome}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/">
                홈
              </Nav.Link>
              <Nav.Link as={Link} to="/movies">
                영화
              </Nav.Link>
            </Nav>

            <Form className="d-flex" onSubmit={searchByKeyword}>
              <Form.Control
                type="search"
                placeholder="검색"
                className="me-2 custom-input"
                aria-label="Search"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
              />
              {/* Button이 submit type인지 유의할 것 */}
              <Button variant="outline-danger" type="submit">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet /> {/* route내의 sub-route를 보여주는 컴포넌트 */}
    </div>
  );
};

export default AppLayout;
