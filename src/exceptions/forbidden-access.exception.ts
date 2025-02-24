import HttpException from "./http.exception";

class ForbiddenAccessException extends HttpException {
  constructor(message: string = "Forbidden access", errors: any = []) {
    super(403, message, errors);
  }
}

export default ForbiddenAccessException;
