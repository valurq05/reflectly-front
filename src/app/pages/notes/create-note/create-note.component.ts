import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Quill from 'quill';
import { Category, DailyLog, DailyLogCreate, EmotionalLog, EmotionalState, Entry, User } from '../../../core/model/common.model';
import { AlertServiceService } from '../../../core/services/alert-service.service';
import { AuthService } from '../../../core/services/auth.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { DailyLogService } from '../../../core/services/daily-log.service';
import { EmotionalStatesService } from '../../../core/services/emotional-states.service';
import { EntryService } from '../../../core/services/entry.service';
import { EmotionalLogService } from '../../../core/services/emotional-log.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.css'],
})
export class CreateNoteComponent implements AfterViewInit {
  user: User | null = null;
  emotionalStates: EmotionalState[] | null = null;
  categories: Category[] | null = null;

  title:string ="Titulo";
  emotionalState: number =3;
  category: number =2;

  editor: Quill | undefined;
  dailyLogId!: string;
  dailyLog: DailyLog | null = null;

  constructor(
    private dailyLogService: DailyLogService,
    private authService: AuthService,
    private EntryService: EntryService,
    private EmotionalLogService: EmotionalLogService,
    private emotionalStatesService: EmotionalStatesService,
    private categorieService: CategoriesService,
    private alertService: AlertServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.dailyLogId = id ? id : '';
    });
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
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: 1 }, { header: 2 }, { font: [] }],
            [{ align: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'video'],
            [{ color: [] }, { background: [] }],
            ['clean'],
          ],
        },
      });
      this.loadDailyLog(); 
    }
  }
  

  loadEmotionalStates() {
    this.emotionalStatesService.getAllEmotionalState().subscribe({
      next: (res: any) => {
        this.emotionalStates = res.Data;
      },
      error: (error: any) => {
        console.log(error, 'No se pudieron cargar los estados emocionales');
      },
    });
  }

  loadDailyLog() {
    this.dailyLogService.getDailyLog(this.dailyLogId).subscribe({
      next: (res) => {
        this.dailyLog = res.Data;
        if (this.dailyLog) {
          this.title = this.dailyLog.entry.entTitle;
          this.emotionalState =
            this.dailyLog.emotionalLog.emotionalState.emoStaId;
  
          
          setTimeout(() => {
            this.setContent(this.dailyLog?.entry?.entText || '');
          }, 0);
        }
      },
      error: (error) => {
        console.log(error, 'No se pudo obtener los detalles de la nota');
      },
    });
  }

  getContent(): string {
    return this.editor ? this.editor.root.innerHTML : '';
  }

  OnSaveItem(): void {
    if (this.user) {
      if (this.dailyLog) {
        const updatedData: Entry = {
          entId: this.dailyLog.entry.entId,
          entDate: this.dailyLog.entry.entDate,
          entText: this.getContent(),
          entTitle: this.title,
          entStatus: this.dailyLog.entry.entStatus,
        };

        const updatedEmotionalLog: EmotionalLog = {
          emoLogId: this.dailyLog.emotionalLog.emoLogId,
          emoLogDate: this.dailyLog.emotionalLog.emoLogDate,
          emotionalState: { emoStaId: this.emotionalState, emoStaState: '' },
          user: this.user,
        };
        console.log(updatedData);
        this.EntryService.updateEntry(updatedData).subscribe({
          next: (response) => {
            this.EmotionalLogService.updateEmotionalLog(
              updatedEmotionalLog
            ).subscribe({
              next: (response) => {
                this.alertService.showAlert(
                  'Nota actualizada',
                  'Tu nota y estado de ánimo se han guardado correctamente',
                  'success'
                );
                setTimeout(() => {
                  this.router.navigate(['home']);
                }, 2000);
              },
              error: (error) => {
                console.error('Error al actualizar el estado de ánimo', error);
                this.alertService.showAlert(
                  'No se ha podido actualizar el estado de ánimo',
                  'Hubo un problema al guardar el estado de ánimo',
                  'error'
                );
              },
            });
          },
          error: (error) => {
            console.error('Error al actualizar la nota', error);
            this.alertService.showAlert(
              'No se ha podido actualizar la nota',
              'Hubo un problema al guardar la nota',
              'error'
            );
          },
        });
      } else {
      
        const newData: DailyLogCreate = {
          useId: this.user?.useId,
          emoStaId: this.emotionalState,
          entText: this.getContent(),
          entTitle: this.title,
        };

        this.dailyLogService.createDailyLog(newData).subscribe({
          next: (response) => {
            this.alertService.showAlert(
              'Creado con éxito',
              'Tu nota ha sido registrada correctamente',
              'success'
            );
            setTimeout(() => {
              this.router.navigate(['home']);
            }, 2000);
          },
          error: (error) => {
            this.alertService.showAlert(
              'No se ha podido crear la nota',
              'Tu nota no ha sido registrada correctamente',
              'error'
            );
          },
        });
      }
    } else {
      // If there's no user logged in, redirect to home
      this.router.navigate(['home']);
    }
  }

  setContent(content: string): void {
    if (this.editor) {
      this.editor.root.innerHTML = content;
    } else {
      console.warn('El editor no está inicializado.');
    }
  }
}
