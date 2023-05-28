import React, { useEffect, useReducer } from "react";
import axios from "axios";
//import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from "../components/Product.js";
import { Helmet } from "react-helmet-async";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      console.log(state);
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      console.log(state, action.payload);
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      console.log(state, action.type, action.payload);
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const HomeScreen = () => {
  // const [products, setProducts] = useState([]);
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  console.log(products);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        console.log(result.data);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>webstore</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        <Row>
          {loading ? (
            <LoadingBox/>
          ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
          ) : (
            products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className='mb-3'>
                <Product product={product}></Product>
              </Col>
            ))
          )}
        </Row>
      </div>
    </div>
  );
};

export default HomeScreen;