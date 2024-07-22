import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  stackCount: number = 0;

  getHello(): string {
    return 'Hello World!';
  }

  addCount() {
    this.stackCount++;
  }

  minusCount() {
    this.stackCount--;
  }
}
