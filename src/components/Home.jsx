import { useEffect, useState } from "react";
import {
    getCategoriesAPICall,  // API call to get categories
    getProductsAPICall,  // API call to get all products
    addProductToCartAPICall,  // API call to add product to cart
} from "../Services/SweetMartService";
import {
    getProductByCategoryAPICall,  // API call to get products by category
    getUserByUsernameOrEmailAPICall,  // API call to get user details
} from "../Services/SweetMartService";
import { useNavigate } from "react-router-dom";  // Hook for navigation
import { getToken } from "../Services/AuthServices";  // Service to get authentication token
import { saveLoggedInUser } from "../Services/AuthServices";  // Service to save logged-in user data
import { Typography, Button, Grid } from "@mui/material";  // Material-UI components
import Banner from "./Banner";  // Banner component
import Featured from "./Footer";  // Footer component
import { Carousel } from "react-responsive-carousel";  // Carousel component
import "react-responsive-carousel/lib/styles/carousel.min.css";  // Carousel CSS

export default function Home({ user, setUser }) {
    const [categories, setCategories] = useState([]);  // State for categories
    const [products, setProducts] = useState([]);  // State for products
    const navigate = useNavigate();  // Navigation hook

    // Function to fetch categories from API
    const fetchCategories = () => {
        getCategoriesAPICall()
            .then((response) => {
                setCategories(response.data);  // Set categories data
            })
            .catch((error) => {
                console.log(error);  // Log any errors
            });
    };

    // Function to fetch all products from API
    const fetchProducts = () => {
        getProductsAPICall()
            .then((response) => {
                setProducts(response.data);  // Set products data
            })
            .catch((error) => console.log(error));  // Log any errors
    };

    // Function to fetch products by category from API
    const fetchProductByCategory = (categoryId) => {
        getProductByCategoryAPICall(categoryId)
            .then((response) => {
                setProducts(response.data);  // Set products data by category
            })
            .catch((error) => {
                console.log(error);  // Log any errors
            });
    };

    // Function to handle category button click
    const handleClick = (categoryId) => {
        fetchProductByCategory(categoryId);  // Fetch products for the clicked category
    };

    // Fetch categories and products on component mount
    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    // Function to handle adding product to cart
    const handleClickAddProduct = (productId) => {
        if (!user) {
            navigate("/login");  // Navigate to login if user is not logged in
        }
        const accessToken = getToken();  // Get authentication token
        addProductToCartAPICall(user.cart.cartId, productId, accessToken)
            .then((response) => {
                console.log(response);  // Log response
                getUserByUsernameOrEmailAPICall(user.username, getToken()).then(
                    (response) => {
                        saveLoggedInUser(response.data);  // Save updated user data
                        setUser(response.data);  // Update user state
                    }
                );
            })
            .catch((error) => {
                console.log(error);  // Log any errors
            });
    };

    return (
        <>
            <div
                className=""
                style={{
                    background: "#F4EEE3", 
                }}
            >
                <div
                    style={{
                        width: "auto",
                    }}
                >
                    <Carousel interval={3000} showThumbs={false} autoPlay={true} showStatus={false}>
                        <div>
                            <img src="images/banner/2.svg" alt="" /> 
                        </div>
                        <div>
                            <img src="images/banner/1.svg" alt="" /> 
                        </div>
                        <div>
                            <img src="images/banner/3.svg" alt="" />  
                        </div>
                        {/* <div>
                            <img src="images/banner/4.svg" alt="" />  // Carousel image 4 (commented out)
                        </div> */}
                    </Carousel>
                </div>
                <Banner></Banner> 
                <br />
                <div
                    style={{
                        paddingRight: "3%",
                        paddingLeft: "3%",
                    }}
                >
                    <br />
                    <Typography variant="h4">Sweets & Savouries</Typography>  
                    <Typography variant="h6">Savor the sweetness of family</Typography> 
                    <br />
                    <Button
                        style={{
                            marginRight: "5px"
                        }}
                        className="button"
                        size="large"
                        variant="contained"
                        onClick={(e) => {
                            fetchProducts();  // Fetch all products on click
                        }}
                    >
                        All
                    </Button>{" "}
                    {categories.map((category) => {  // Map through categories
                        return (
                            <>
                                <Button
                                    style={{
                                        marginRight: "5px"
                                    }}
                                    className="button"
                                    size="large"
                                    variant="contained"
                                    key={category.categoryId}  // Unique key for each category
                                    onClick={(e) => {
                                        handleClick(category.categoryId);  // Fetch products by category on click
                                    }}
                                >
                                    {category.name}  
                                </Button>{" "}
                            </>
                        );
                    })}
                    <br />
                    <br />
                    <br />
                    <Grid container className="standard-gridcontainer" spacing={2}>
                        {products.map((product) => {  // Map through products
                            return (
                                <Grid
                                    item
                                    lg={3}
                                    key={product.productId}  // Unique key for each product
                                    className="standard-griditem"
                                    style={{
                                        padding: "10px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <div onClick={() => { navigate(`product/${product.productId}`) }}  // Navigate to product details on click
                                        className="photobox"
                                        style={{
                                            borderRadius: "10px",
                                            overflow: "hidden",
                                            height: "200px",
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <img
                                            className="home-image"
                                            style={{
                                                maxHeight: "100%",
                                                maxWidth: "100%",
                                                borderRadius: "10px"
                                            }}
                                            src={product.photoPath}  // Product image
                                            alt=""
                                        />
                                    </div>
                                    <Typography
                                        style={{
                                            textTransform: "capitalize",
                                            textAlign: "center",
                                            marginTop: "10px",
                                            height: "40px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        variant="h6"
                                    >
                                        {product.name}  
                                    </Typography>
                                    <Typography
                                        style={{
                                            color: "#88070a",
                                        }}
                                    >
                                        <strong>₹{product.price}</strong>{" "}<span style={{ color: "grey", fontSize: "11px" }}>/ 500g</span> 
                                    </Typography>
                                    {user && user.roles[0].name !== "ROLE_ADMIN" ? (  // Check if user is not admin
                                        <Button
                                            style={{
                                                width: "100%",
                                                marginTop: "auto",
                                            }}
                                            className="button"
                                            variant="contained"
                                            size="large"
                                            onClick={() => {
                                                handleClickAddProduct(product.productId);  // Add product to cart on click
                                            }}
                                        >
                                            Add to cart
                                        </Button>
                                    ) : null}
                                </Grid>
                            );
                        })}
                    </Grid>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            </div>
            <Featured></Featured> 
        </>
    );
}

















// import { useEffect, useState } from "react";
// import {
//     getCategoriesAPICall,
//     getProductsAPICall,
//     addProductToCartAPICall,
// } from "../Services/SweetMartService";
// import {
//     getProductByCategoryAPICall,
//     getUserByUsernameOrEmailAPICall,
// } from "../Services/SweetMartService";
// import { useNavigate } from "react-router-dom";
// import { getToken } from "../Services/AuthServices";
// import { saveLoggedInUser } from "../Services/AuthServices";
// import { Typography, Button, Grid } from "@mui/material";
// import Banner from "./Banner";
// import Featured from "./Footer";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";

// export default function Home({ user, setUser }) {
//     const [categories, setCategories] = useState([]);
//     const [products, setProducts] = useState([]);
//     const navigate = useNavigate();

//     const fetchCategories = () => {
//         getCategoriesAPICall()
//             .then((response) => {
//                 setCategories(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     const fetchProducts = () => {
//         getProductsAPICall()
//             .then((response) => {
//                 setProducts(response.data);
//             })
//             .catch((error) => console.log(error));
//     };

//     const fetchProductByCategory = (categoryId) => {
//         getProductByCategoryAPICall(categoryId)
//             .then((response) => {
//                 setProducts(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     const handleClick = (categoryId) => {
//         fetchProductByCategory(categoryId);
//     };

//     useEffect(() => {
//         fetchCategories();
//         fetchProducts();
//     }, []);

//     const handleClickAddProduct = (productId) => {
//         if (!user) {
//             navigate("/login");
//         }
//         const accessToken = getToken();
//         addProductToCartAPICall(user.cart.cartId, productId, accessToken)
//             .then((response) => {
//                 console.log(response);
//                 getUserByUsernameOrEmailAPICall(user.username, getToken()).then(
//                     (response) => {
//                         saveLoggedInUser(response.data);
//                         setUser(response.data);
//                     }
//                 );
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     return (
//         <>
//             <div
//                 className=""
//                 style={{
//                     background: "#F4EEE3",
//                 }}
//             >
//                 <div
//                     style={{
//                         width: "auto",
//                     }}
//                 >
//                     <Carousel interval={3000} showThumbs={false} autoPlay={true} showStatus={false}>
//                         <div>
//                             <img src="images/banner/2.svg" alt="" />
//                         </div>
//                         <div>
//                             <img src="images/banner/1.svg" alt="" />
//                         </div>
//                         <div>
//                             <img src="images/banner/3.svg" alt="" />
//                         </div>
//                         {/* <div>
//                             <img src="images/banner/4.svg" alt="" />
//                         </div> */}
//                     </Carousel>
//                 </div>
//                 <Banner></Banner>
//                 <br />
//                 <div
//                     style={{
//                         paddingRight: "3%",
//                         paddingLeft: "3%",
//                     }}
//                 >
//                     <br />
//                     <Typography variant="h4">Sweets & Savouries</Typography>
//                     <Typography variant="h6">Savor the sweetness of family</Typography>
//                     <br />
//                     <Button
//                         style={{
//                             marginRight : "5px"
//                         }}
//                         className="button"
//                         size="large"
//                         variant="contained"
//                         onClick={(e) => {
//                             fetchProducts();
//                         }}
//                     >
//                         All
//                     </Button>{" "}
//                     {categories.map((category) => {
//                         return (
//                             <>
//                                 <Button
//                                     style={{
//                                         marginRight : "5px"
//                                     }}
//                                     className="button"
//                                     size="large"
//                                     variant="contained"
//                                     key={category.categoryId}
//                                     onClick={(e) => {
//                                         handleClick(category.categoryId);
//                                     }}
//                                 >
//                                     {category.name}
//                                 </Button>{" "}
//                             </>
//                         );
//                     })}
//                     <br />
//                     <br />
//                     <br />
//                     <Grid container className="standard-gridcontainer" spacing={2}>
//                         {products.map((product) => {
//                             return (
//                                 <Grid
//                                     item
//                                     lg={3}
//                                     key={product.productId}
//                                     className="standard-griditem"
//                                     style={{
//                                         padding: "10px",
//                                         display: "flex",
//                                         flexDirection: "column",
//                                         alignItems: "center",
//                                     }}
//                                 >
//                                     <div onClick={() => {navigate(`product/${product.productId}`)}}
//                                         className="photobox"
//                                         style={{
//                                             borderRadius: "10px",
//                                             overflow: "hidden",
//                                             height: "200px",
//                                             width: "100%",
//                                             display: "flex",
//                                             justifyContent: "center",
//                                             alignItems: "center",
//                                         }}
//                                     >
//                                         <img
//                                             className="home-image"
//                                             style={{
//                                                 maxHeight: "100%",
//                                                 maxWidth: "100%",
//                                                 borderRadius : "10px"
//                                             }}
//                                             src={product.photoPath}
//                                             alt=""
//                                         />
//                                     </div>
//                                     <Typography
//                                         style={{
//                                             textTransform: "capitalize",
//                                             textAlign: "center",
//                                             marginTop: "10px",
//                                             height: "40px",
//                                             overflow: "hidden",
//                                             textOverflow: "ellipsis",
//                                             whiteSpace: "nowrap",
//                                         }}
//                                         variant="h6"
//                                     >
//                                         {product.name}
//                                     </Typography>
//                                     <Typography
//                                         style={{
//                                             color: "#88070a",
//                                         }}
//                                     >
//                                         <strong>₹{product.price}</strong>{" "}<span style={{ color : "grey", fontSize : "11px" }}>/ 500g</span>
//                                     </Typography>
//                                     {user && user.roles[0].name !== "ROLE_ADMIN" ? (
//                                         <Button
//                                             style={{
//                                                 width: "100%",
//                                                 marginTop: "auto",
//                                             }}
//                                             className="button"
//                                             variant="contained"
//                                             size="large"
//                                             onClick={() => {
//                                                 handleClickAddProduct(product.productId);
//                                             }}
//                                         >
//                                             Add to cart
//                                         </Button>
//                                     ) : null}
//                                 </Grid>
//                             );
//                         })}
//                     </Grid>
//                     <br />
//                     <br />
//                     <br />
//                     <br />
//                     <br />
//                     <br />
//                 </div>
//             </div>
//             <Featured></Featured>
//         </>
//     );
// }
