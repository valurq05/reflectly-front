import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import Quill from 'quill';
import { Category, DailyLogCreate, EmotionalState, User } from '../../../core/model/common.model';
import { AlertServiceService } from '../../../core/services/alert-service.service';
import { AuthService } from '../../../core/services/auth.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { DailyLogService } from '../../../core/services/daily-log.service';
import { EmotionalStatesService } from '../../../core/services/emotional-states.service';
@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.css'
})
//error por llamar el componente en dos modulos (notas y app) 
//pero si no lo hago no funcion el ForModule para binding [(ngModel)]
export class CreateNoteComponent implements AfterViewInit 
{
  user: User | null = null;
  emotionalStates: EmotionalState[] | null = null;
  categories: Category[] | null = null;

  title:string ="Titulo";
  emotionalState: number =3;
  category: number =2;

  editor: Quill | undefined;

  constructor(private dailyLogService: DailyLogService, 
    private authService: AuthService, 
    private emotionalStatesService: EmotionalStatesService,
    private categorieService: CategoriesService,
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

      this.categorieService.getCategories().subscribe({
        next: (res)=>{
          this.categories=res.Data
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
  //trae el contenido de lo escrito por el user
  getContent(): string {
    return this.editor ? this.editor.root.innerHTML : '';
  }

  OnSaveItem(): any{
    if(this.user){
      const data:DailyLogCreate={
        useId: this.user?.useId,
        emoStaId: this.emotionalState,
        entText: this.getContent(),
        entTitle: this.title
      }

      console.log(data.entText)

      try{
        this.dailyLogService.createDailyLog(data).subscribe({
          next:(response)=>{
            this.alertService.showAlert("Creado con exito", "Tu nota ha sido registrada correctamente", "success")
            setTimeout(()=>{
              this.router.navigate(["home"])}, 2000) 
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
