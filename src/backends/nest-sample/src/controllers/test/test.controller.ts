import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { Response } from 'express';

@Controller('test')
export class TestController {
  constructor(private appService: AppService) {

  }

  @Get()
  _(): string {
    return 'hi...';
  }

  @Get('/stackCount')
  countStack(@Res() response: Response) {
    this.appService.addCount();
    return response
      .status(200)
      .json({
        count: this.appService.stackCount,
      });
  }
}
