import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './users.model'
import { CreateUserDto } from './dto/create-user.dto'
import { RolesService } from '../roles/roles.service'
import { IUserProfile } from './types/types'

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly roleService: RolesService,
  ) {
  }

  async createNewUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto)
    const role = await this.roleService.getRoleByValue('USER')
    await user.$set('roles', [role.id])
    user.roles = [role]
    return user
  }

  async getAllUsers() {
    return await this.userRepository.findAll({ include: { all: true } })
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id }, include: { all: true } })
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email }, include: { all: true } })
  }

  async updateUserById(id: number, user: IUserProfile) {
    return await this.userRepository.update(user, { where: { id } })
  }

  async deleteUserById(id: number) {
    return await this.userRepository.destroy({ where: { id: id } })
  }
}
