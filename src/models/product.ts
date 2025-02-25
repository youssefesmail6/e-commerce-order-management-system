import { Column, DataType, Model, Table } from "sequelize-typescript";

export enum ProductCategory {
  ELECTRONICS = "Electronics",
  FASHION = "Fashion",
  HOME_APPLIANCES = "Home Appliances",
  BEAUTY = "Beauty",
  SPORTS = "Sports",
}

export interface ProductCreationAttributes {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
}

@Table({
  tableName: "products",
  modelName: "Product",
})
class Product extends Model<Product, ProductCreationAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.DECIMAL(10, 2), // for price with decimal precision
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.ENUM(...Object.values(ProductCategory)),
    allowNull: false,
 })  
  category!: ProductCategory;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stock!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;
}

export default Product;
