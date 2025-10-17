import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  NotFoundException,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtAuthGuard } from '@/interfaces/http/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/interfaces/http/auth/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { CreateUserDto } from '@/core/application/dto/user/create-user.dto';
import { UpdateUserDto } from '@/core/application/dto/user/update-user.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @Roles('admin', 'manager')
  @Get()
  async findAll() {
    return await this.userService.findAllUsers();
  }

  @Roles('admin', 'manager', 'staff')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.removeUser(id);
    return { success: true };
  }
}
