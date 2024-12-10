import { Injectable } from '@angular/core';
import { ApiResponse, Collaborator } from '../model/common.model';
import { ApiEndpoint } from '../constants.ts/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  constructor(private http: HttpClient) { }


  createCollaborator(Collaborator: Collaborator){
    console.log(Collaborator);
    return this.http.post(ApiEndpoint.Collaborator.Create, Collaborator);
  }
}
