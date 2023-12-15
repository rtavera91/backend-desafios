import { fakerES_MX as faker } from "@faker-js/faker";

export const generateProducts = () => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push({
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      status: faker.datatype.boolean(),
      category: faker.commerce.department(),
      brand: faker.commerce.productMaterial(),
    });
  }
  return products;
};
