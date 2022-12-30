import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  async getPage1(@Req() req: Request, @Res() res: Response){
    res.sendFile(join(__dirname, '../../client/public', 'page.html'));
  }
}

