import { productsManager } from "../dao/managers/productManager.js";

export const findAll = async () => {
  try {
    const products = await productsManager.findAll();
    return products;
  } catch (error) {
    throw new Error("Internal Server Error");
  }
};

export const findById = async (id) => {
  try {
    const product = await productsManager.findById(id);
    console.log("product:", product);

    if (!product) {
      return { error: "Product Not Found" };
    }

    return product;
  } catch (error) {
    throw new Error("Internal Server Error");
  }
};

export const createOne = async (productData) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock = 0,
    category,
    thumbnail,
  } = productData;

  if (!title || !description || !code || !price) {
    throw new Error("All fields are required");
  } else if (!stock) {
    delete productData.stock;
  } else {
    try {
      const createdProduct = await productsManager.createOne(productData);
      return createdProduct;
    } catch (error) {
      console.error(error.message);
      throw new Error("Internal Server Error");
    }
  }
};

export const updateOne = async (id, product) => {
  const { pid } = req.params;
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  } = req.body;
  try {
    const updatedProduct = await productsManager.updateOne(
      pid,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    );
    res.status(200).json({ message: "Product updated" });
    return updatedProduct;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteOne = async (id) => {
  const { pid } = req.params;
  try {
    const deletedProduct = await productsManager.deleteOne(pid);
    res.status(200).json({ message: "Product deleted" });
    return deletedProduct;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
