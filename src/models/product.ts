import { Column, DataType, Model, Table } from "sequelize-typescript";



export interface ProductCreationAttributes {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

@Table({
  tableName: "products",
  modelName: "Product",
})
class Product extends Model<Product> {
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
    type: DataType.STRING,
    allowNull: false,
 })  
  category!: string;

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
