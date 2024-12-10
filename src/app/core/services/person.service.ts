import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEndpoint } from '../constants.ts/constants';
import { ApiResponse, Person, UpdatePerson } from '../model/common.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http:HttpClient) { }

  public updatePerson(person:UpdatePerson|Person){
    return this.http.put<ApiResponse<Person>>(ApiEndpoint.Person.Update, person)
  }
}
