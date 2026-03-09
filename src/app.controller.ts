import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response } from 'express';
import { UrlService } from './url/url.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly urlService: UrlService,
  ) {}

  @Get(':id')
  viewOne(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
    return this.urlService.go2(id, res, req);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
