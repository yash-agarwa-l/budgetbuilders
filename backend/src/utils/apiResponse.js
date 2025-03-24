/**
 * Successful response envelope. Kept as (statusCode, message, data) to match
 * the shape the mobile client already consumes.
 */
class ApiResponse {
  constructor(statusCode, message = "Success", data = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
