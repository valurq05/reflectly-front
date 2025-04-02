import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, imageAI, Photo } from '../model/common.model';
import { ApiEndpoint } from '../constants.ts/constants';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private http: HttpClient) { }

  public getUserPhotos(userId: number): Observable<Photo[]> {
    return this.http.get<{ Data: Photo[] }>(
      ApiEndpoint.image.userImages.replace('{userId}', userId.toString())
    ).pipe(
      map(response =>
        response.Data.map(photo => ({
          ...photo,
          fullPath: ApiEndpoint.image.showPhotos.replace('{filename}', photo.rutaArchivo)
        }))
      )
    );
  }

  public uploadNewImage(userId: number){
    let params = new HttpParams().set('userId', userId.toString());

    return this.http.post<ApiResponse<Photo>>(ApiEndpoint.image.uploadGalleryImage,{
      params: params,
    });
  }

  public getImageDescription(fileName: string) {
    console.log("hola el nombre del coso desde el servicio " + fileName);
    
    let params = new HttpParams().set('filename', fileName);
  
    return this.http.post<imageAI>(ApiEndpoint.image.clasifyImages, {}, { params: params });
  }
  

}
