import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/model/common.model';

@Component({
  selector: 'app-admin-patients',
  templateUrl: './admin-patients.component.html',
  styleUrl: './admin-patients.component.css'
})
export class AdminPatientsComponent implements OnInit {

  users: User[] | null = null

  constructor(private userService_: UserService){
  }

  ngOnInit() {
    console.log("cargado componente pacientes")
    this.readUserNotes();
  }

  private readUserNotes() { 
    this.userService_.GetAllUsers().subscribe(response => {
      this.users = response.Data;
      console.log("pacientes" + response.Data)
      })
  }
  
}
