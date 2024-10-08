import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Product } from './products.model'
import { Store } from '../stores/stores.model'
import { ProductStore } from '../product-in-store/product-stores.model'
import { Category } from '../categories/category.model'
import { JwtModule } from '@nestjs/jwt'
import { Cross } from '../cross/cross.model'

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    SequelizeModule.forFeature([Product, Store, ProductStore, Category, Cross]),
    JwtModule],
})
export class ProductsModule {
}
