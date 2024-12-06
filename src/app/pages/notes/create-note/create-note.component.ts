import { AfterViewInit, Component } from '@angular/core';
import Quill from 'quill';
import { DailyLogService } from '../../../core/services/daily-log.service';
import { DailyLog, User, EmotionalState } from '../../../core/model/common.model';
import { AuthService } from '../../../core/services/auth.service';
import { EmotionalStatesService } from '../../../core/services/emotional-states.service';
import { AlertServiceService } from '../../../core/services/alert-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.css'
})
export class CreateNoteComponent implements AfterViewInit 
{
  user: User | null = null;
  emotionalStates: EmotionalState[] | null = null;
  title:string ="Titulo";
  emotionalState: number =1;
  editor: Quill | undefined;

  constructor(private dailyLogService: DailyLogService, 
    private authService: AuthService, 
    private emotionalStatesService: EmotionalStatesService,
    private alertService: AlertServiceService,
    private router: Router){
  }

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    console.log(this.user);
    try{
      this.emotionalStatesService.getAllEmotionalState().subscribe({
        next: (res)=>{
          this.emotionalStates=res.Data
        },error: (error)=>{
          console.log(error, "Hola, no funciona")
        }
      })
    }catch(e){
      console.log(e, "catch")
    }
  }

  ngAfterViewInit(): void {
    const editorContainer = document.getElementById('editor-container');
    if (editorContainer) {
      this.editor = new Quill(editorContainer, {
        theme: 'snow', 
        modules: {
          //todo lo que permite hacer la libreria al usuario en la barra 
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], 
            [{ 'header': 1 }, { 'header': 2 }, { 'font': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'], 
            [{ 'color': [] }, { 'background': [] }],
            ['clean'] 
          ],
        },
      });
    }
  }
  //trae el contenido de lo escrito por el user
  getContent(): string {
    return this.editor ? this.editor.root.innerHTML : '';
  }

  OnSaveItem(): any{
    if(this.user){
      const data:DailyLog={
        useId: this.user?.useId,
        emoStaId: this.emotionalState,
        entText: this.getContent(),
        entTitle: this.title
      }
      try{
        this.dailyLogService.createDailyLog(data).subscribe({
          next:(response)=>{
            this.alertService.showAlert("Creado con exito", "Tu nota ha sido registrada correctamente", "success")
            setTimeout(()=>{
              this.router.navigate(["home"])}, 3000) 
          }, error:(error)=>{
            this.alertService.showAlert("No se ha podido crear la nota", "Tu nota no ha sido registrada correctamente", "error")

          }
        })
      }catch(error){
        console.log(error,"catch")
  
      }
    }
  } 
}
