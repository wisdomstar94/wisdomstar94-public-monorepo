import { Controller, Get, Res, Sse } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { Response } from 'express';
import { setTimeout } from 'timers/promises';
import { interval, map, Observable } from 'rxjs';

export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Controller('test')
export class TestController {
  constructor(private appService: AppService) {}

  @Get()
  _(): string {
    return 'hi...';
  }

  @Get('stackCount')
  async countStack(@Res() response: Response) {
    console.log('/test/stackCount api called!');
    this.appService.addCount();

    const responseData = {
      count: this.appService.stackCount,
    };

    await setTimeout(3000);
    console.log('/test/stackCount api called! --> response:', responseData);
    return response.status(200).json(responseData);
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000 * 120).pipe(
      map((_) => ({ data: { hello: 'world', timestamp: Date.now() } })),
    );
  }
}
