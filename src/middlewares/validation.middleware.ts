import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import BadRequestException from "../exceptions/bad-request.exception";

const ValidationMiddleware = (
  type: any,
  skipMissingProperties = false,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const transformedBody = plainToInstance(type, req.body);

    validate(transformedBody, { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const formatedErrors = getErrorsFormated(errors);
          return next(new BadRequestException("BAD_REQUEST", formatedErrors));
        } else {
          req.body = transformedBody;
          next();
        }
      },
    );
  };
};

export const getErrorsFormated = (errors: ValidationError[]): any => {
  const formattedErrors: any = [];
  errors.forEach((e: ValidationError) => {
    formattedErrors.push({
      [e.property]: [...Object.values(e.constraints ?? {})],
    });
  });
  return formattedErrors;
};

export default ValidationMiddleware;
