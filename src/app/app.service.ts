import { Injectable } from '@nestjs/common';

@Injectable({})
export class AppService {
  serverOnline() {
    return `
          <h1 style="text-align: center; margin-top: 50vh;"}>
          WELCOME TO THE API SERVER RUNNING WITH NEST
          </h1>
      `;
  }
}
