import { Injectable } from '@nestjs/common';

@Injectable()
export class TestApiService {
  async getResponse() {
    try {
      return 'This is a response from nestjs';
    } catch (error) {
      return error;
    }
  }

  async getCat() {
    try {
      return 'This is a cat';
    } catch (error) {
      return error;
    }
  }

  async getDog() {
    try {
      return 'This is a dog';
    } catch (error) {
      return error;
    }
  }
}
