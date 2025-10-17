import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepositoryImpl } from '@/infrastructure/db/typeorm/user.repository.impl';
import { BcryptService } from '@/infrastructure/security/bcrypt.service';
import { AuthService } from '@/interfaces/http/auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '@/core/application/dto/user/create-user.dto';
import { UpdateUserDto } from '@/core/application/dto/user/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: UserRepositoryImpl,
    private readonly bcryptService: BcryptService,
    private readonly authService: AuthService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await this.bcryptService.hash(dto.password);
    const user = await this.userRepo.create({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? 'staff',
      currentHashedRefreshToken: null,
    } as any);

    const tokens = await this.authService.generateTokensForUser(
      user.id,
      user.email,
      user.role,
    );

    return { ...tokens, user };
  }

  async findAllUsers() {
    return this.userRepo.findAll();
  }

  async findUserById(id: string) {
    return this.userRepo.findById(id);
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    if (dto.password)
      user.password = await this.bcryptService.hash(dto.password);

    return this.userRepo.update(user);
  }

  async removeUser(id: string) {
    return this.userRepo.delete(id);
  }

  async updateEmail(userId: string, newEmail: string) {
    const existingUser = await this.userRepo.findByEmail(newEmail);
    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }

    await this.userRepo.updateEmail(userId, newEmail);
    return { success: true };
  }
}
