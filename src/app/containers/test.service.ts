import { Injectable } from '@angular/core';
import { HttpServiceGenerator } from '../shared';
import { tap, map } from 'rxjs/operators';

interface ILimitCurrent {
  limit: string;
  currentTotal: string;
}

@Injectable({
  providedIn: 'root'
})


export class TestService {

  constructor(private httpG: HttpServiceGenerator) { }
  private testApi = this.httpG.make('/test');

  GetData(params) {
    return this.testApi.Get('getDataTest', params).pipe(tap(data => {
      console.log(data);
    }));
  }
}
