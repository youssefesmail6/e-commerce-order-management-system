import { Router } from "express";
import upload from "../middlewares/upload.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import asyncHandler from "../middlewares/async-handler";
import ProductController from "../controllers/product.controller";
import { adminRateLimiter } from "../middlewares/rateLimit.middleware";
import CreateProductDto from "../dtos/createProduct.dto";
import { IsAdminMiddleware, IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import UpdateProductDto from "../dtos/updateProduct.dto";

export default async () => {
  const productController = await ProductController.init();
  const router = Router();

  router.post(
    "/v1/product/create-product",
    adminRateLimiter,
    IsAuthenticatedMiddleware,
    IsAdminMiddleware,
    ValidationMiddleware(CreateProductDto),
    asyncHandler(productController.createProduct.bind(productController)),
  );
  router.get(
    "/v1/product/:id",
    IsAuthenticatedMiddleware,
    IsAdminMiddleware,
    asyncHandler(productController.getProductById.bind(productController)),
    );
    //update
    router.put(
      "/v1/product/:id",
      adminRateLimiter,
      IsAuthenticatedMiddleware,
      IsAdminMiddleware,
      ValidationMiddleware(UpdateProductDto),
      asyncHandler(productController.updateProduct.bind(productController)),
    );
    //delete
    router.delete(
      "/v1/product/:id",
      adminRateLimiter,
      IsAuthenticatedMiddleware,
      IsAdminMiddleware,
      asyncHandler(productController.deleteProduct.bind(productController)),
    );
    //get all products
    router.get(
      "/v1/products",
      IsAuthenticatedMiddleware,
      asyncHandler(productController.getAllProducts.bind(productController)),
    );
    router.post(
        "/v1/products/import",
        adminRateLimiter,
        IsAuthenticatedMiddleware,
        IsAdminMiddleware,
        upload.single("file"),
        asyncHandler(productController.bulkImport.bind(productController))
      );
    
  return router;
};
