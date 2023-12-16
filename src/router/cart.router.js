import { Router } from "express";
import { isUser } from "../middlewares/auth.middleware.js";
import { cartsManager } from "../dao/managers/cartManager.js";
import { productsManager } from "../dao/managers/productManager.js";
import { findProductById } from "../controllers/products.controller.js";
import passport from "passport";
import { generateUniqueID } from "../public/js/uniqueID.js";
import {
  findCarts,
  findCartById,
  createCart,
  updateCart,
  deleteCart,
  deleteCartProduct,
  deleteCartProducts,
} from "../controllers/carts.controller.js";

import {
  findTickets,
  findTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/tickets.controller.js";
const router = Router();

// IMPLEMENTACIÓN DE ARQUITECTURA POR CAPAS
router.get("/", findCarts);
router.get("/:cid", findCartById);
router.post(
  "/",
  //isUser,
  createCart
);
router.put("/:cid/product/:pid", isUser, updateCart);
router.delete("/:cid", isUser, deleteCart);
router.delete("/:cid/product/:pid", isUser, deleteCartProduct);
router.delete("/:cid/products", isUser, deleteCartProducts);

// Lógica de Tickets
router.post("/:cid/purchase", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsManager.findById(cartId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    let productsToBuy = cart.products;
    let productsNotProcessed = [];
    let ticketQuantity = 0;

    for (let productToBuy of productsToBuy) {
      let productID = productToBuy._id.toString();
      let quantityToBuy = productToBuy.quantity;
      ticketQuantity += quantityToBuy;

      // //verificar stock del producto
      // const product = await findProductById({ pid: productID });
      // // console.log("product:", product);

      // //   if (!product || product.stock < quantityToBuy) {
      // //     productsNotProcessed.push(productID);
      // //   } else {
      // //     //actualizar stock del producto
      // //     let newStock = product.stock - quantityToBuy;
      // //     await productsManager.updateOne(productID, { stock: newStock });
      // //     await product.save();

      // //actualizamos el carrito del usuario con los productos que no se pudieron comprar
      // if (productsNotProcessed.length > 0) {
      //   const updatedProducts = cart.products.filter(
      //     (product) => !productsNotProcessed.includes(product._id.toString())
      //   );
      //   await cartsManager.updateOne(cartId, {
      //     products: updatedProducts,
      //   });
    }
    //creamos una nueva compra por cada producto comprado
    const ticketData = {
      cart: cartId,
      purchase_datetime: new Date(),
      // purchaser: req.user.email,
      quantity: ticketQuantity,
      code: generateUniqueID(),
    };
    console.log("ticketData:", ticketData);

    const createdTicket = await createTicket(ticketData);
    console.log("createdTicket:", createdTicket);

    //enviamos la respuesta al cliente
    res.status(200).json({
      message: "Purchase completed",
      products_not_processed: productsNotProcessed,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//---------DE AQUI PARA ABAJO ES LO QUE TENÍAMOS HASTA LA CLASE PASADA DONDE EL MANAGER SE COMUNICABA CON EL DAO------------//

// // obtener los carritos
// router.get("/cart", async (req, res) => {
//   try {
//     const carts = await cartsManager.findAll();
//     if (!carts.length) {
//       res.status(200).json({ message: "No Carts Found" });
//     } else {
//       res.status(200).json({ message: "Carts found", carts });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // crear carrito
// router.post("/cart", async (req, res) => {
//   const { productID } = req.body;
//   try {
//     await cartsManager.createOne(...productID);
//     res.status(200).json({ message: "Cart created" });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // obtener carrito por id
// router.get("/cart/:cid", async (req, res) => {
//   const { cid } = req.params;
//   try {
//     const cart = await cartsManager.findById(cid); // Pasa el ID del carrito
//     if (cart) {
//       res.status(200).json({ message: "Cart found", cart });
//     } else {
//       res.status(404).json({ message: "Cart not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // agregar producto a carrito existente
// router.post("/cart/:cid/product/:pid", async (req, res) => {
//   const { cid, pid } = req.params;
//   const quantity = parseInt(req.body.quantity, 10);
//   try {
//     const updatedCart = await cartsManager.updateOne(cid, pid, quantity);
//     if (updatedCart) {
//       res
//         .status(200)
//         .json({ message: "Product added to cart", cart: updatedCart });
//     } else {
//       res.status(404).json({ message: "Cart or Product not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// //elimina de un carrito, un producto seleccionado
// router.delete("/cart/:cid/product/:pid", async (req, res) => {
//   const { cid, pid } = req.params;
//   try {
//     const updatedCart = await cartsManager.deleteProduct(cid, pid);
//     if (updatedCart) {
//       res
//         .status(200)
//         .json({ message: "Product deleted from cart", cart: updatedCart });
//     } else {
//       res.status(404).json({ message: "Cart or Product not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // modificamos la cantidad de un producto en un carrito
// router.put("/cart/:cid/product/:pid", async (req, res) => {
//   const { cid, pid } = req.params;
//   const quantity = parseInt(req.body.quantity, 10);
//   try {
//     const updatedCart = await cartsManager.updateOne(cid, pid, quantity);
//     res
//       .status(200)
//       .json({ message: "Product quantity updated", cart: updatedCart });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

export const cartRouter = router;
