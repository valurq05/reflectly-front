import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEndpoint } from '../constants.ts/constants';
import { ApiResponse } from '../model/common.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http:HttpClient) { }

  getCategories(){
    return this.http.get<ApiResponse<any>>(ApiEndpoint.categories.getAll)
  }
}
