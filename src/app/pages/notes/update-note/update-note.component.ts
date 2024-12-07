import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Quill from 'quill';
import { DailyLogCreate, EmotionalState, User } from '../../../core/model/common.model';
import { AlertServiceService } from '../../../core/services/alert-service.service';
import { AuthService } from '../../../core/services/auth.service';
import { DailyLogService } from '../../../core/services/daily-log.service';
import { EmotionalStatesService } from '../../../core/services/emotional-states.service';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.component.html',
  styleUrl: './update-note.component.css'
})
export class UpdateNoteComponent {

  user: User | null = null;
  emotionalStates: EmotionalState[] | null = null;
  title:string ="";
  emotionalState: number =3;
  editor: Quill | undefined;
  noteId!: string; 
  constructor(private route: ActivatedRoute,
    private dailyLogService: DailyLogService, 
    private authService: AuthService, 
    private emotionalStatesService: EmotionalStatesService,
    private alertService: AlertServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.noteId = this.route.snapshot.paramMap.get('id')!; 

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

      this.dailyLogService.getDailyLog(this.noteId).subscribe({
        next: (res)=>{

          console.log(res)
          this.title=res.Data.entry.entTitle
          this.emotionalState = res.Data.emotionalLog.emotionalState.emoStaId
          this.setContent(res.Data.entry.entText)
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
            ['link', 'video'], 
            [{ 'color': [] }, { 'background': [] }],
            ['clean'] 
          ],
        },
      });
    }
  }

  OnSaveItem(): any{
    if(this.user){
      const data:DailyLogCreate={
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
  getContent(): string {
    return this.editor ? this.editor.root.innerHTML : '';
  }

  setContent(content: string): void {
    if (this.editor) {
        this.editor.root.innerHTML = content;
    }
}
}
