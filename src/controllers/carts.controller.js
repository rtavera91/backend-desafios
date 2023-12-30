import {
  findAll,
  findById,
  createOne,
  updateOne,
  deleteOne,
  deleteAllProducts,
  deleteProduct,
} from "../services/carts.service.js";
// import NotFoundError from "../errors/not_found.error.js";
import CustomError from "../errors/not_found.error.js";
import { ErrorMessages } from "../errors/error.enum.js";

export const findCarts = async (req, res) => {
  const carts = await findAll();
  if (!carts.length) {
    res.status(200).json(CustomError.createError(ErrorMessages.NO_CARTS_FOUND));
  } else {
    res.status(200).json({ message: "Carts found", carts });
  }
};

export const findCartById = async (req, res) => {
  const { cid } = req.params;
  const cart = await findById(cid); // Pasa el ID del carrito
  if (cart) {
    res.status(200).json({ message: "Cart found", cart });
  } else {
    res.status(404).json(CustomError.createError(ErrorMessages.NO_CARTS_FOUND));
  }
};

export const createCart = async (req, res) => {
  try {
    const { products } = req.body;

    const createdCart = await createOne(...products, req.user);
    res.status(200).json({ message: "Cart created", cart: createdCart });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json(CustomError.createError(ErrorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const updateCart = async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = parseInt(req.body.quantity, 10);
  try {
    const updatedCart = await updateOne(cid, pid, quantity, req.user);
    if (updatedCart) {
      res
        .status(200)
        .json({ message: "Product added to cart", cart: updatedCart });
    } else {
      res.status(404).json({ message: "Cart or Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const result = await deleteOne(cid);
    if (result) {
      res.status(200).json({ message: "Cart deleted" });
    } else {
      res
        .status(404)
        .json(CustomError.createError(ErrorMessages.NO_CARTS_FOUND));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartProduct = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await deleteProduct(cid, pid);
    if (updatedCart) {
      res.status(200).json({ message: "Product deleted from cart" });
    } else {
      res
        .status(404)
        .json(CustomError.createError(ErrorMessages.NO_CARTS_FOUND));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartProducts = async (req, res) => {
  const { cid } = req.params;
  try {
    const result = await deleteAllProducts(cid);
    if (result) {
      res.status(200).json({ message: "Cart products deleted" });
    } else {
      res
        .status(404)
        .json(CustomError.createError(ErrorMessages.NO_CARTS_FOUND));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
