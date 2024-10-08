import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './users.model'
import { IUserProfile } from './types/types'
import { Roles } from 'src/decorators/role-auth.decorator'
import { RolesGuard } from 'src/guards/roles.guard'

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  createNewUser(@Body() dto: CreateUserDto) {
    return this.usersService.createNewUser(dto)
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  @Roles('ADMIN', 'USER')
  @UseGuards(RolesGuard)
  getAllUser() {
    return this.usersService.getAllUsers()
  }

  @ApiOperation({ summary: 'get user by id' })
  @ApiResponse({ status: 200, type: User })
  @Get('/:id')
  @Roles('ADMIN', 'USER')
  @UseGuards(RolesGuard)
  getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(id)
  }

  @ApiOperation({ summary: 'get user by id' })
  @ApiResponse({ status: 200, type: User })
  @Patch('/profile/:id')
  @Roles('ADMIN', 'USER')
  @UseGuards(RolesGuard)
  updateUserById(@Param('id') id: number, @Body() user: IUserProfile) {
    return this.usersService.updateUserById(id, user)
  }

  @Delete('/:id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  deleteUserById(@Param('id') id: number) {
    return this.usersService.deleteUserById(id)
  }
}
