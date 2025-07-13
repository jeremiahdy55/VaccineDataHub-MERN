import * as ActionTypes from "../ActionTypes";
import axios from "axios";

export const setHospitals = (hospitals) => ({
  // this function expects that hospitals is an array of type: JS object
  type: ActionTypes.SET_HOSPITALS,
  payload: hospitals
});

// export const fetchCart = (userId) => {
//   return function (dispatch) {
//     axios
//       .get(`http://localhost:9000/cart/api/${userId}`)
//       .then((response) => {
//         let cart = response.data;
//         if (cart) {
//           dispatch(
//             setHospitals(
//               cart.userId,
//               cart.items.map((p) => ({
//                 productId: p.productId,
//                 name: p.name,
//                 desc: p.desc,
//                 rating: p.rating,
//                 price: p.price,
//                 qty: p.qty,
//                 category: p.category,
//               }))
//             )
//           );
//         } else {
//           // If no cart, clear redux-store of any cart data
//           dispatch(clearCart());
//         }
//       })
//       .catch((err) => {
//         console.log("Error While Fetching Cart", err);
//       });
//   };
// };

// // Save single cart item, this is accessible from ProductItemComponent.js
// export const saveCartItem = (userId, product) => {
//   return function (dispatch) {
//     axios
//       .post(`http://localhost:9000/cart/api/saveCartItem`, {
//         userId,
//         product,
//       })
//       .then((response) => {
//         const updatedCart = response.data;
//         dispatch(
//           setCart(
//             updatedCart.userId,
//             updatedCart.items.map((p) => ({
//               productId: p.productId,
//               name: p.name,
//               desc: p.desc,
//               rating: p.rating,
//               price: p.price,
//               qty: p.qty,
//               category: p.category,
//             }))
//           )
//         );
//         const totalItems = updatedCart.items.reduce(
//           (sum, product) => sum + product.qty,
//           0
//         );
//         dispatch(
//           saveNotification(userId, {
//             content: `${product.name} was saved to Cart. Total items: ${totalItems}`,
//             type: "dynamic",
//             navigateTo: "/cart",
//           })
//         );
//       })
//       .catch((error) => {
//         console.error("Error saving item to cart:", error);
//       });
//   };
// };

// // Saves the product to the redux-store ONLY (does not go to MongoDB)
// // Accessible from CartItemComponent.js
// export const saveItemToStoreCart = (userId, product) => {
//   return function (dispatch, getState) {
//     const state = getState();
//     const cart = [...state.cartReducer.items]; //make local copy
//     console.log(product);
//     let { name, desc, rating, price, qty, category } = product;
//     let productId = product._id;
//     console.log("productId" + productId);
//     const index = cart.findIndex((p) => p.name.toString() === name);
//     if (index > -1) {
//       cart[index] = { ...cart[index], qty: cart[index].qty + qty };
//     } else {
//       cart.push({ productId, name, desc, rating, price, qty, category });
//     }
//     dispatch(setCart(userId, cart));
//   };
// };

// // Saves the current redux-store cart-state to MongoDB
// // Accessible from CartComponent.js (checkout button)
// export const saveCartMultipleItems = (userId, products) => {
//   console.log(products);
//   return function (dispatch) {
//     axios
//       .post(`http://localhost:9000/cart/api/saveCartMultipleItems`, {
//         userId,
//         productsFromStore: products,
//       })
//       .then((response) => {
//         const updatedCart = response.data;
//         dispatch(
//           setCart(
//             updatedCart.userId,
//             updatedCart.items.map((p) => ({
//               productId: p.productId,
//               name: p.name,
//               desc: p.desc,
//               rating: p.rating,
//               price: p.price,
//               qty: p.qty,
//               category: p.category,
//             }))
//           )
//         ); // end dispatch(setCart())
//         const totalItems = updatedCart.items.reduce(
//           (sum, product) => sum + product.qty,
//           0
//         );
//         dispatch(
//           saveNotification(userId, {
//             content: `Multiple items simultaneously saved to Cart. Total items: ${totalItems}`,
//             type: "dynamic",
//             navigateTo: "/cart",
//           })
//         ); // end dispatch(saveNotification())
//       })
//       .catch((error) => {
//         console.error("Error saving item to cart:", error);
//       });
//   };
// };

// // Remove an item from the store cart, only called in checkout page where cart is then saved later
// export const removeItemFromCart = (userId, product) => {
//   return function (dispatch, getState) {
//     const state = getState();
//     const cart = [...state.cartReducer.items]; //make local copy
//     let { name, desc, rating, price, qty, category } = product;
//     const index = cart.findIndex((p) => p.name.toString() === name);
//     if (index > -1) {
//       // if the item is in the cart already
//       cart.splice(index, 1); // remove the whole product from the cart
//       // This is NOT decrementing qty
//     } else {
//       // if the item does not exist in the cart yet
//       alert("Trying to remove a nonexistent item!");
//     }
//     dispatch(setCart(userId, cart));
//   };
// };

// export const repopulateCartWithOrder = (userId, orderId) => {
//   return function (dispatch) {
//     axios
//       .get(`http://localhost:9000/orders/api/getOrder/${orderId}`)
//       .then((response) => {
//         const order = response.data;
//         dispatch(
//           saveCartMultipleItems(
//             userId,
//             order.cart.map((p) => ({
//               productId: p.productId,
//               name: p.name,
//               desc: p.desc,
//               rating: p.rating,
//               price: p.price,
//               qty: p.qty,
//               category: p.category,
//             }))
//           )
//         );
//         const totalItems = order.cart.reduce(
//           (sum, product) => sum + product.qty,
//           0
//         );
//         dispatch(
//           saveNotification(userId, {
//             content: `Additional notification: Multiple items simultaneously saved to Cart due to Reorder. Total items: ${totalItems}`,
//             type: "dynamic",
//             navigateTo: "/cart",
//           })
//         ); // end dispatch(saveNotification())
//       })
//       .catch((error) => {
//         console.error("Error saving and retrieving orders:", error);
//       });
//   };
// };
