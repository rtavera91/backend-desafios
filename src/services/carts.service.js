// Cart service se comunica con el manager de cart, que a su vez se comunica con el modelo de cart.
import { cartsManager } from "../dao/managers/cartManager.js";

export const findAll = async () => {
  try {
    const carts = await cartsManager.findAll();
    return carts;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while finding all carts" };
  }
};

export const findById = async (id) => {
  try {
    const cart = await cartsManager.findById(id);
    return cart;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while finding cart by ID" };
  }
};

export const createOne = async (...products) => {
  // Si el usuario no está logueado, no puede crear un carrito
  if (!req.user) {
    return { error: "You must be logged in to create a cart" };
  }

  // Si el usuario logueado es premium, verifica que sea el propietario de todos los productos
  if (req.user.role === "premium") {
    for (const product of products) {
      const foundProduct = await productsManager.findById(product.id);

      if (!foundProduct || foundProduct.owner !== req.user.email) {
        return {
          error: "You must be the owner of all products to create a cart",
        };
      }
    }
  }

  try {
    const cart = await cartsManager.createOne(...products);
    return cart;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while creating cart" };
  }
};

export const updateOne = async (cid, pid, quantity) => {
  // Si el usuario no está logueado, no puede actualizar el carrito
  if (!req.user) {
    return { error: "You must be logged in to update a cart" };
  }

  try {
    // Obtener información del producto antes de la actualización
    const existingProduct = await cartsManager.findProductInCart(cid, pid);

    // Si el usuario es premium, verificar que sea el propietario del producto
    if (
      req.user.role === "premium" &&
      existingProduct.owner !== req.user.email
    ) {
      return {
        error: "You must be the owner of the product to update the cart",
      };
    }

    // Actualizar el carrito
    const cart = await cartsManager.updateOne(cid, pid, quantity);
    return cart;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while updating cart" };
  }
};

export const deleteOne = async (id) => {
  try {
    const result = await cartsManager.deleteOne(id);
    return result;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while deleting cart" };
  }
};

export const deleteProduct = async (cid, pid) => {
  try {
    const result = await cartsManager.deleteProduct(cid, pid);
    return result;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while deleting product from cart" };
  }
};

export const deleteAllProducts = async (cid) => {
  try {
    const result = await cartsManager.deleteAllProducts(cid);
    return result;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while deleting all products from cart" };
  }
};
