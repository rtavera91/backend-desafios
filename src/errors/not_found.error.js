// export default class NotFoundError {
//   static createError(entity) {
//     const error = new Error(`${entity} not found`);
//     error.name = "NotFoundError";
//     throw error;
//   }
// }

export default class CustomError {
  static createError(message) {
    const error = new Error(`${message}`);
    throw error;
  }
}
