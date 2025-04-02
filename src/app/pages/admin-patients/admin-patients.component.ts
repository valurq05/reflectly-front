import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { chatBotPayLoad, emotionPayload, User } from '../../core/model/common.model';

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
  overallEmotion: string = '';
  emoji: string = '';
  contexto:string = '';
  loading:boolean = true;

  constructor(private userService_: UserService) { }

  ngOnInit() {
    console.log("Cargando componente pacientes");
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
    this.getAllNotes(this.selectedUserId);
    this.chatResponse = '';
  }

  getAllNotes(userId: number){
    console.log(userId);
    if (!userId) {
      console.log("No hay usuario seleccionado");
      return;
    }
    console.log("Usuario a sacar contexto:" + this.selectedUserId);
    this.userService_.readAllEntries(userId).subscribe(res =>{
      this.contexto = res.Data;
      this.getEmotions(this.contexto);
    })
  }
  
  getEmotions(contexto:string) {
    const payload: emotionPayload = {
      texto: contexto
    };
    this.userService_.getEmotions(payload).subscribe(res => {
      this.overallEmotion = res.emocion;
      this.emoji = res.emoji
      console.log(res);
      this.loading = false;
    });
  }
  
  onSubmit() {
      const payload: chatBotPayLoad = {
        contexto: this.contexto,  
        pregunta: this.question
      };

      this.userService_.askChatBot(payload).subscribe(res => {
        this.chatResponse = res.respuesta;
      });
  }
 
}
