import Container from "typedi";
import fs from "fs";
import csvParser from "csv-parser";
import { Op } from "sequelize";
import { Logger } from "../services/logger.service";
import Product, {
  ProductCategory,
  ProductCreationAttributes,
} from "../models/product";
import BadRequestException from "../exceptions/bad-request.exception";
import { RedisService } from "./redis.service";

interface ProductFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

class ProductService {
  private logger: Logger = Container.get(Logger);
  private redisClient = RedisService.getClient();

  private constructor() {}

  public static async init(): Promise<ProductService> {
    return new ProductService();
  }

  async createProduct(
    productData: ProductCreationAttributes,
  ): Promise<Product> {
    try {
      // 🔍 Check if a product with the same name already exists
      const existingProduct = await Product.findOne({
        where: { name: productData.name },
      });

      if (existingProduct) {
        throw new BadRequestException("This product already exists.");
      }

      const product = await Product.create({ ...productData });
      return product;
    } catch (error: any) {
      this.logger.error(`ProductService.createProduct: ${error.message}`);
      throw error;
    }
  }

  async getAllProducts(
    filters: ProductFilterOptions,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ products: Product[]; totalCount: number }> {
    try {
      const whereConditions: any = {};

      // Filter by category if provided
      if (filters.category) {
        if (!Object.values(ProductCategory).includes(filters.category as ProductCategory)) {
          throw new Error(`Invalid category: ${filters.category}`);
        }
        whereConditions.category = filters.category;
      }

      // Filter by price range
      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        whereConditions.price = { [Op.between]: [filters.minPrice, filters.maxPrice] };
      } else if (filters.minPrice !== undefined) {
        whereConditions.price = { [Op.gte]: filters.minPrice };
      } else if (filters.maxPrice !== undefined) {
        whereConditions.price = { [Op.lte]: filters.maxPrice };
      }

      // Filter by availability
      if (filters.inStock !== undefined) {
        whereConditions.stock = filters.inStock ? { [Op.gt]: 0 } : 0;
      }
      const cacheKey = Object.keys(filters).length > 0
      ? `products:${JSON.stringify(filters)}:page:${page}:size:${pageSize}`
      : `products:all:page:${page}:size:${pageSize}`;

      await this.redisClient.del(cacheKey);
      // Count total matching products
      const totalCount = await Product.count({
        where: Object.keys(whereConditions).length ? whereConditions : undefined,
      });

      // Fetch products with pagination
      const products = await Product.findAll({
        where: Object.keys(whereConditions).length ? whereConditions : undefined,
        offset: (page - 1) * pageSize,
        limit: pageSize,
      });

      return { products, totalCount };
    } catch (error: any) {
      this.logger.error(`ProductService.getProducts: ${error.message}`);
      throw error;
    }
  }


  //Get product by ID
  async getProductById(productId: string): Promise<Product | null> {
    try {
      return await Product.findByPk(productId);
    } catch (error: any) {
      this.logger.error(`ProductService.getProductById: ${error.message}`);
      throw error;
    }
  }

  //Update product details
  async updateProduct(
    productId: string,
    updateData: Partial<ProductCreationAttributes>,
  ): Promise<Product | null> {
    try {
      const product = await Product.findByPk(productId);
      if (!product) throw new BadRequestException("Product not found");

      await product.update(updateData);
      return product;
    } catch (error: any) {
      this.logger.error(`ProductService.updateProduct: ${error.message}`);
      throw error;
    }
  }

  // Delete a product
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const deletedRows = await Product.destroy({ where: { id: productId } });
      return deletedRows > 0;
    } catch (error: any) {
      this.logger.error(`ProductService.deleteProduct: ${error.message}`);
      throw error;
    }
  }
  async bulkImport(filePath: string): Promise<{ importedCount: number }> {
    const products: ProductCreationAttributes[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
      //Instead of fs.readFileSync() I used .pipe cause it is more efficient 
        .pipe(csvParser())
        .on("data", (row) => {
          // Convert CSV row to Product format
          const product: ProductCreationAttributes = {
            name: row.name,
            description: row.description,
            price: parseFloat(row.price),
            category: row.category,
            stock: parseInt(row.stock, 10),
          };
          products.push(product);
        })
        .on("end", async () => {
          try {
            // Insert products in bulk
            await Product.bulkCreate(products);
            resolve({ importedCount: products.length });
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => reject(error));
    });
  }
}

export default ProductService;
