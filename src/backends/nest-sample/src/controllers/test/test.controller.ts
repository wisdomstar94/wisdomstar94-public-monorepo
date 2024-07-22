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
    
    const responseData = {
      count: this.appService.stackCount,
    };
    console.log('/test/stackCount api called! --> response:', responseData);

    return response.status(200).json(responseData);
  }
}
