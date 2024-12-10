import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../constants.ts/constants';
import { ApiResponse, DailyLog, DailyLogCreate, updateDailyLog } from '../model/common.model';


@Injectable({
  providedIn: 'root'
})
export class DailyLogService {

  constructor(private http: HttpClient) { }


  getDailyUserLogs(userId: number, date?: string, categoryId?: number): Observable<any> {

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

  createDailyLog(dailyLog:DailyLogCreate){
    return this.http.post(ApiEndpoint.DailyLog.Create, dailyLog)
  }

  getDailyLog(id:string){
    const params = new HttpParams().set('id', id);
    return this.http.get<ApiResponse<DailyLog>>(ApiEndpoint.DailyLog.GetById, { params });
  }

  updateDailyLog(dailyLogUpdate: updateDailyLog, id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.put<ApiResponse<DailyLog>>(
      ApiEndpoint.DailyLog.Update,
      dailyLogUpdate, 
      { params } 
    );
  }
  
  deleteEntry(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.delete(ApiEndpoint.Entry.Delete, { params });
  }

}