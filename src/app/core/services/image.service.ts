import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEndpoint } from '../constants.ts/constants';
import { ApiResponse } from '../model/common.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http:HttpClient) { }

  public updateProfilePhoto(image:File, userId:number){
    const params = new HttpParams().set('userId', userId);
    const formData = new FormData();
    formData.append('file', image); 
    return this.http.post<ApiResponse<any>>(ApiEndpoint.image.updateUserPhoto,formData,{params})
  }
}
