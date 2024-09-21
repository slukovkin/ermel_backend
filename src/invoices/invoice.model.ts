import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Order } from '../orders/order.model'
import { InvoiceCreationDto } from './dto/invoice.dto'
import { User } from '../users/users.model'

@Table({ tableName: 'invoices' })
export class Invoice extends Model<Invoice, InvoiceCreationDto> {

  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  doc_number: string

  @Column({ type: DataType.STRING, allowNull: false })
  type: string

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  customerId: number

  @Column({ type: DataType.STRING, allowNull: false })
  date: string

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: true })
  orderId: number

  @Column({ type: DataType.DOUBLE, allowNull: false })
  amount: number

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  status: boolean

  @BelongsTo(() => Order)
  order: Order

  @BelongsTo(() => User)
  customer: User
}