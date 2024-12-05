import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiEndpoint } from '../constants.ts/constants';


@Injectable({
  providedIn: 'root'
})
export class DailyLogService {

  constructor(private http: HttpClient) { }


  getDailyUserLogs(userId: number, token: string, date?: string, categoryId?: number): Observable<any> {

    let params = new HttpParams();
    params = params.set('userId', userId.toString());
    if (date) {
      params = params.set('date', date);
    }
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    return this.http.get(ApiEndpoint.DailyLog.GetDailyUserLog, { params });
  }
}
