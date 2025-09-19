import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRepositoryImpl } from '@/infrastructure/db/typeorm/user.repository.impl';
import { BcryptService } from '@/infrastructure/security/bcrypt.service';
import { AuthService } from '@/interfaces/http/auth/auth.service';
import { RolesGuard } from '@/interfaces/http/auth/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { CreateUserDto } from '@/core/application/dto/user/create-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('users')
export class UserController {
  constructor(
    private readonly userRepo: UserRepositoryImpl,
    private readonly bcryptService: BcryptService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const hashed = await this.bcryptService.hash(dto.password);
    const created = await this.userRepo.create({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      password: hashed,
      currentHashedRefreshToken: null,
    } as any);

    const savedUser = await this.userRepo.findById(created.id);
    if (!savedUser) {
      throw new Error('Failed to fetch created user from database');
    }

    const tokens = await this.authService.generateTokensForUser(
      savedUser.id,
      savedUser.email,
      savedUser.role,
    );

    return {
      ...tokens,
      user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
    };
  }

  @Get()
  async findAll() {
    const users = await this.userRepo.findAll();
    return users.map((u) => ({ id: u.id, name: u.name, email: u.email }));
  }

  async findOne(@Param('id') id: string) {
    const u = await this.userRepo.findById(id);
    if (!u) return { message: 'Not found' };
    return { id: u.id, name: u.name, email: u.email };
  }

  async update(@Param('id') id: string, @Body() dto: Partial<CreateUserDto>) {
    const user = await this.userRepo.findById(id);
    if (!user) return { message: 'Not found' };
    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    if (dto.password)
      user.password = await this.bcryptService.hash(dto.password);
    const updated = await this.userRepo.update(user);
    return { id: updated.id, name: updated.name, email: updated.email };
  }

  async remove(@Param('id') id: string) {
    await this.userRepo.delete(id);
    return { success: true };
  }
}
