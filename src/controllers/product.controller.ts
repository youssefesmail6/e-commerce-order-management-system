import Container from "typedi";
import { Logger } from "../services/logger.service";
import { NextFunction, Request, Response } from "express";
import ProductService from "../services/product.service";
import CreateProductDto from "../dtos/createProduct.dto";
import NotFoundException from "../exceptions/not-found.exception";
import UpdateProductDto from "../dtos/updateProduct.dto";
import { ProductCategory } from "../models/product";

class ProductController {
  private logger: Logger = Container.get(Logger);
  private productService: ProductService;

  private constructor(productService: ProductService) {
    this.productService = productService;
  }

  public static init = async (): Promise<ProductController> => {
    const service = await ProductService.init();
    return new ProductController(service);
  };

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const createProductDto = req.body as CreateProductDto;
      const product = await this.productService.createProduct(createProductDto);

      return res.status(201).json(product);
    } catch (error: any) {
      this.logger.error(`ProductController.createProduct: ${error.message}`);
      throw error;
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract and parse query parameters
      const filters = {
        category: req.query.category
          ? (req.query.category as ProductCategory)
          : undefined,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
        inStock:
          req.query.inStock !== undefined
            ? req.query.inStock === "true"
            : undefined,
      };

      // Extract pagination parameters
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

      // Fetch filtered or all products with pagination
      const { products, totalCount } = await this.productService.getAllProducts(
        filters,
        page,
        pageSize,
      );


      return res.json({
        data: products,
        page,
        pageSize,
        totalCount,
      });
    } catch (error: any) {
      this.logger.error(`ProductController.getAllProducts: ${error.message}`);
      next(error);
    }
  }

  //Get a product by ID
  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      return res.status(200).json(product);
    } catch (error: any) {
      this.logger.error(`ProductController.getProductById: ${error.message}`);
      next(error);
    }
  }

  /**
   * Update a product (Admin only)
   */
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateProductDto = req.body as UpdateProductDto;

      const updatedProduct = await this.productService.updateProduct(
        id,
        updateProductDto,
      );

      if (!updatedProduct) {
        throw new NotFoundException("Product not found");
      }

      return res.status(204).send();
    } catch (error: any) {
      this.logger.error(`ProductController.updateProduct: ${error.message}`);
      next(error);
    }
  }

  //Delete a product (Admin only)
  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await this.productService.deleteProduct(id);

      if (!deleted) {
        throw new NotFoundException("Product not found");
      }

      return res.status(204).send();
    } catch (error: any) {
      this.logger.error(`ProductController.deleteProduct: ${error.message}`);
      next(error);
    }
  }
  async bulkImport(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await this.productService.bulkImport(req.file.path);
      return res.json({
        message: "Products imported successfully",
        importedCount: result.importedCount,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default ProductController;
