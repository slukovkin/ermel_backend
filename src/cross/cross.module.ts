import { Module } from '@nestjs/common'
import { CrossController } from './cross.controller'
import { CrossService } from './cross.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Cross } from './cross.model'

@Module({
  imports: [SequelizeModule.forFeature([Cross])],
  controllers: [CrossController],
  providers: [CrossService],
})
export class CrossModule {
}
