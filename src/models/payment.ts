import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    BelongsTo,
  } from "sequelize-typescript";
  import Order from "./order";
  
  export enum PaymentStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
  }
  
  @Table({
    tableName: "payments",
    modelName: "Payment",
  })
  class Payment extends Model {
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
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    paymentIntentId!: string;
  
    @Column({
      type: DataType.ENUM(...Object.values(PaymentStatus)),
      allowNull: false,
      defaultValue: PaymentStatus.PENDING,
    })
    status!: PaymentStatus;
  
    @BelongsTo(() => Order)
    order!: Order;
  
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
  
  export default Payment;
  