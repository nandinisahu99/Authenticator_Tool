export class ErrorHandler extends Error {
  //custom class for application level error handling
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
