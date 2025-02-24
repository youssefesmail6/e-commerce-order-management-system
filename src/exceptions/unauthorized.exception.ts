import HttpException from "./http.exception";

class UnauthorizedException extends HttpException {
  constructor(error: string = "Unauthorized access") {
    super(401, error);
  }
}

export default UnauthorizedException;
