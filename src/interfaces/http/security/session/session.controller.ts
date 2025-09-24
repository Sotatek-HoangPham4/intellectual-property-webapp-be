import {
  Controller,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/interfaces/http/auth/guards/jwt-auth.guard';
import { SessionService } from './session.service';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async list(@Req() req: any) {
    const userId = req.user?.sub;
    const sessions = await this.sessionService.listSessions(userId);
    return sessions;
  }

  @Delete(':id')
  @HttpCode(204)
  async revoke(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.sub;
    await this.sessionService.revokeSession(userId, id);
  }

  @Delete()
  @HttpCode(204)
  async revokeAll(@Req() req: any) {
    const userId = req.user?.sub;
    await this.sessionService.revokeAll(userId);
  }
}
