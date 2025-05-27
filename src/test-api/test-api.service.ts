import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TestApiService {
  async getResponse() {
    try {
      return 'This is a response from nestjs';
    } catch (error) {
      return error;
    }
  }

  async getCat(req: Request) {
    try {
      console.log(req.user);
      return req.user;
    } catch (error) {
      return error;
    }
  }

  async getDog(body: any) {
    try {
      console.log(body);
      return body;
      // return 'This is a dog';
    } catch (error) {
      return error;
    }
  }
}
