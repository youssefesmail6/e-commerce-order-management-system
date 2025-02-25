import bcrypt from "bcryptjs";
import { Column, DataType, Model, Table, BeforeCreate } from "sequelize-typescript";

export enum RoleNames {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface AdminCreationAttributes {
  name: string;
  email: string;
  hashedPassword: string;
  isAdmin?: boolean;
}

export interface UserCreationAttributes extends AdminCreationAttributes {
  role: RoleNames;
}

@Table({
  tableName: "users",
  modelName: "User",
  hooks: {
    beforeCreate: async (user: User) => {
      user.hashedPassword = await bcrypt.hash(user.hashedPassword, 10);
    },
    beforeUpdate: async (user: User) => {
      if (user.changed("hashedPassword")) {
        user.hashedPassword = await bcrypt.hash(user.hashedPassword, 10);
      }
    },
  },
})
class User extends Model {
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
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashedPassword!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isAdmin!: boolean;

  @Column({
    type: DataType.ENUM(RoleNames.ADMIN, RoleNames.CUSTOMER),
    allowNull: true,
  })
  role?: RoleNames;
  @BeforeCreate
  static assignAdminRole(user: User) {
    if (user.isAdmin) {
      user.role = RoleNames.ADMIN;
    }
  }
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

export default User;
