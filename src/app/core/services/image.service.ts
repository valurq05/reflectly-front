import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEndpoint } from '../constants.ts/constants';
import { ApiResponse } from '../model/common.model';
import { map, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  public updateProfilePhoto(image: File, userId: number) {
    const params = new HttpParams().set('userId', userId);
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post<ApiResponse<any>>(
      ApiEndpoint.image.updateUserPhoto,
      formData,
      { params }
    );
  }

  showImage(filename: string): any {
    return this.http
      .get(`${ApiEndpoint.image.showImage.replace('{filename}', filename)}`, {
        responseType: 'blob',
      })
      .pipe(
        map((blob: Blob) => {
          const objectURL = URL.createObjectURL(blob);
          return this.sanitizer.bypassSecurityTrustUrl(objectURL);
        })
      );
  }

  getDefaultImage(): Observable<any> {

    return this.http.get(`${ApiEndpoint.image.defaultImage}`, {
      responseType: 'blob',
    }).pipe(
      map((blob: Blob) => {
        const objectURL = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
    );
  }

  changeProfilePhoto(image: File, userId: number) {
    const params = new HttpParams().set('userId', userId);
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post<ApiResponse<any>>(
      ApiEndpoint.image.updateUserPhoto,
      formData,
      { params }
    );
  }
}
