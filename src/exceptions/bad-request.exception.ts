import HttpException from "./http.exception";

class BadRequestException extends HttpException {
  constructor(message: string, errors: any = []) {
    super(400, message, errors);
  }
}

export default BadRequestException;
