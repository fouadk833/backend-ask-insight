// domain.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MsAuthGuard } from '../auth/ms-auth.guard';
import { Request } from 'express';
import { DomainService } from '../services/domain.service';
import { AuthenticatedRequest } from 'src/auth/types/user-request.interface';

@Controller('domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) { }

  
  @Get()
  async getDomains(@Req() req: AuthenticatedRequest) {
    const email = req.user?.email || req.user?.preferred_username;
    console.log('Email from token:', email);
    if (!email) {
      console.log('No Email found', email)
      return { email }
    }
    const domains = await this.domainService.getDomainsByUserEmail(email);
    console.log('Token successfully verified');
    return { email, domains };
  }
}
