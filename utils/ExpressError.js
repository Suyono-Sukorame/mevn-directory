// utils/ExpressError.js
class ExpressError extends Error {
  constructor(message, statusCode) {
    super(message); // Mengirim pesan ke kelas Error
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
