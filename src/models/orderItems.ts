import {
    Column,
    DataType,
    Model,
    Table,
    ForeignKey,
  } from 'sequelize-typescript';
  import Order from './order';
  import Product from './product';
  
  export interface OrderItemCreationAttributes {
    orderId: string;
    productId: string;
    quantity: number;
    price: number; // Price at the time of order
  }
  
  @Table({
    tableName: 'order_items',
    modelName: 'OrderItem',
  })
  class OrderItem extends Model<OrderItem, OrderItemCreationAttributes> {
    @Column({
      primaryKey: true,
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
    })
    id!: string;
  
    @ForeignKey(() => Order)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    orderId!: string;
  
    @ForeignKey(() => Product)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    productId!: string;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    quantity!: number;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
    })
    price!: number;
  
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
  
  export default OrderItem;
  