import HttpException from "./http.exception";

class NotFoundException extends HttpException {
  constructor(message: string, errors?: any) {
    super(404, message, errors);
  }
}

export default NotFoundException;
