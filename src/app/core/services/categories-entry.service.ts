import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, CategoriesEntry } from '../model/common.model';
import { ApiEndpoint } from '../constants.ts/constants';

@Injectable({
  providedIn: 'root'
})
export class CategoriesEntryService {

  constructor(private http:HttpClient) { }

  createCategoryEntry(CategoriesEntry: CategoriesEntry){
    return this.http.post(ApiEndpoint.CategoriesEntry.Create, CategoriesEntry);
  }

  getAllCategoriesEntry(entId: number){
    let params = new HttpParams();
    params = params.set('entry', entId.toString());
    return this.http.get<ApiResponse<CategoriesEntry>>(`${ApiEndpoint.CategoriesEntry.GetAllCategoriesEntry}`, { params });
  }

  deleteCategoryEntry(catEntId: number){

    let params = new HttpParams();
    params = params.set('catEntId', catEntId.toString());
    return this.http.delete(`${ApiEndpoint.CategoriesEntry.Delete}`, { params });
  }
}
