import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { chatBotPayLoad, User } from '../../core/model/common.model';

@Component({
  selector: 'app-admin-patients',
  templateUrl: './admin-patients.component.html',
  styleUrl: './admin-patients.component.css'
})
export class AdminPatientsComponent implements OnInit {

  users: User[] | null = null;
  selectedUserId: number | null = null;
  question: string = '';       
  chatResponse: string = ''; 

  constructor(private userService_: UserService) { }

  ngOnInit() {
    console.log("Cargado componente pacientes");
    this.readUserNotes();
  }

  private readUserNotes() { 
    this.userService_.GetAllUsers().subscribe(response => {
      this.users = response.Data;
      console.log("Pacientes: ", response.Data);
    });
  }

  openModal(userId: number) {
    this.selectedUserId = userId;
    this.chatResponse = '';
    console.log("Usuario seleccionado para consulta:", userId);
  }

   onSubmit() {
    if (!this.selectedUserId || !this.question.trim()) {
      console.log("No hay usuario seleccionado o la pregunta está vacía.");
      return;
    }

    console.log(this.selectedUserId);

    this.userService_.readAllEntries(this.selectedUserId).subscribe(response => {
      const contexto = response.Data;
      console.log("Contexto obtenido:", contexto);

      const payload: chatBotPayLoad = {
        contexto: contexto,  
        pregunta: this.question
      };

      this.userService_.askChatBot(payload).subscribe(res => {
        this.chatResponse = res;
        console.log("✅ Respuesta del chatbot:", res);
      });
    });
  }
 
}
