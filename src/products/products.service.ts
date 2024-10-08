import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateProductDto } from './dto/create-product.dto'
import { IProductUpdateAttributes } from './types/types'
import { Product } from './products.model'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { Cross } from '../cross/cross.model'
import { Sequelize } from 'sequelize-typescript'
import { Op } from 'sequelize'

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Cross) private crossModel: typeof Cross,
    private sequelize: Sequelize) {
  }

  async create(productDto: CreateProductDto) {
    const candidate = await this.getProductByCode(productDto.code)
    if (candidate) throw new HttpException('Товар уже есть в БД', HttpStatus.CONFLICT)
    const crossCode = Number(productDto.code.toString().slice(0, 5))
    return await this.productRepository.create({ ...productDto, cross: crossCode })
  }

  async getAllProduct() {
    return await this.productRepository.findAll({ include: { all: true } })
  }

  async getProductById(id: number) {
    return await this.productRepository.findOne({ where: { id }, include: { all: true } })
  }

  async getProductByCode(code: number) {
    return await this.productRepository.findOne({ where: { code }, include: { all: true } })
  }

  async getProductByCross(code: string) {
    return await this.productRepository.findOne({ where: { code }, include: { all: true } })
  }

  async pullAllProductsFromStoreByArrayId(productIds: number[]) {
    return await this.productRepository.findAll({
      where: {
        id: {
          [Op.in]: productIds, // Поиск по массиву productId
        },
      },
      include: { all: true }, // Включение всех ассоциаций, если необходимо
    })
  }

  async getAllProductsByOrigin(origin: string) {
    const cleanedOriginal = origin.replace(/[^a-zA-Z0-9]/g, '')
    const request = `%${cleanedOriginal}%`
    return await this.sequelize.query(
      `SELECT p.*
       FROM products AS p
       INNER JOIN cross_table AS ct
       ON p.cross = ct.code
       WHERE ct.origin LIKE :request`,
      {
        replacements: { request }, // Безопасная подстановка параметров
        model: Product, // Указываем модель, чтобы результат был представлен как экземпляры модели
        mapToModel: true, // Указываем, что нужно сопоставить результат с моделью
      },
    )
  }

  async updateProductById(id: number, product: IProductUpdateAttributes) {
    return await this.productRepository.update<Product>(product, { where: { id } })
  }


  async deleteProductById(id: number) {
    const product = await this.getProductById(id)
    // TODO #2:Переделать удаление изображения товара при удалении товара из БД
    const directory = path.resolve(__dirname, '../..', 'storage')
    const filename = product.imageUrl?.split('/')[3]
    fs.unlink(`${directory}/${filename}`, (err) => {
      console.log(err)
    })
    return await this.productRepository.destroy({ where: { id: id } })
  }
}
