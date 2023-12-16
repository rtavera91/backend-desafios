import { ticketsManager } from "../dao/managers/ticketManager.js";

export const findAll = async () => {
  try {
    const tickets = await ticketsManager.findAll();
    return tickets;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while finding all tickets" };
  }
};

export const findById = async (id) => {
  try {
    const ticket = await ticketsManager.findById(id);
    return ticket;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while finding ticket by ID" };
  }
};

export const createOne = async (
  cart,
  purchase_datetime,
  quantity,
  purchaser,
  code
) => {
  try {
    const ticketData = {
      cart,
      purchase_datetime,
      quantity,
      purchaser,
      code,
    };

    const ticket = await ticketsManager.createOne(ticketData);
    return ticket;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while creating ticket" };
  }
};

export const updateOne = async (id, data) => {
  try {
    const ticket = await ticketsManager.updateOne(id, data);
    return ticket;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while updating ticket" };
  }
};

export const deleteOne = async (id) => {
  try {
    const result = await ticketsManager.deleteOne(id);
    return result;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while deleting ticket" };
  }
};
