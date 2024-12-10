import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Quill from 'quill';
import {
  Category,
  DailyLog,
  DailyLogCreate,
  EmotionalLog,
  EmotionalState,
  Entry,
  User,
  Collaborator,
} from '../../../core/model/common.model';
import { AlertServiceService } from '../../../core/services/alert-service.service';
import { AuthService } from '../../../core/services/auth.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { DailyLogService } from '../../../core/services/daily-log.service';
import { EmotionalStatesService } from '../../../core/services/emotional-states.service';
import { EntryService } from '../../../core/services/entry.service';
import { EmotionalLogService } from '../../../core/services/emotional-log.service';
import { UserService } from '../../../core/services/user.service';
import { CollaboratorService } from '../../../core/services/collaborator.service';
import { CategoriesEntry } from '../../../core/model/common.model';
import { CategoriesEntryService } from '../../../core/services/categories-entry.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.css'],
})
export class CreateNoteComponent implements AfterViewInit {
  user: User | null = null;
  emotionalStates: EmotionalState[] | null = null;
  

  title: string = 'Titulo';
  emotionalState: number = 3;
  category: number = 2;
  

  editor: Quill | undefined;
  dailyLogId!: string;
  entryId!: number;
  dailyLog: DailyLog | null = null;

  collaborators: User[] = [];
  selectedCollaborator: User | null = null;
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  CategoriesEntry : CategoriesEntry[] = [];

  constructor(
    private dailyLogService: DailyLogService,
    private authService: AuthService,
    private EntryService: EntryService,
    private EmotionalLogService: EmotionalLogService,
    private emotionalStatesService: EmotionalStatesService,
    private categorieService: CategoriesService,
    private alertService: AlertServiceService,
    private UserService: UserService,
    private CollaboratorService: CollaboratorService,
    private CategoriesEntryService: CategoriesEntryService,
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
    try {
      this.emotionalStatesService.getAllEmotionalState().subscribe({
        next: (res) => {
          this.emotionalStates = res.Data;
        },
        error: (error) => {
          console.log(error, 'Hola, no funciona');
        },
      });

      this.categorieService.getCategories().subscribe({
        next: (res) => {
          this.categories = res.Data;
        },
        error: (error) => {
          console.log(error, 'Hola, no funciona');
        },
      });

      this.loadCollaborators();

      if (!this.dailyLogId) {
        this.createDefaultEntry();
      } else {
        this.loadDailyLog();
      }
    } catch (e) {
      console.log(e, 'catch');
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

      this.dailyLogService.getDailyLog(this.dailyLogId).subscribe({
        next: (res) => {
          this.dailyLog = res.Data;
          console.log(this.dailyLog);
          if (this.dailyLog) {
            this.setContent(this.dailyLog.entry.entText);
          }
        },
        error: (error) => {
          console.error('No se pudo obtener los detalles de la nota', error);
        },
      });
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
        console.log(res.Data);
        this.dailyLog = res.Data;
        if (this.dailyLog) {
          this.title = this.dailyLog.entry.entTitle;
          this.emotionalState =
            this.dailyLog.emotionalLog.emotionalState.emoStaId;
            this.loadCategoriesEntry(this.dailyLog.entry.entId);
        }
      },
      error: (error) => {
        console.log(error, 'No se pudo obtener los detalles de la nota');
      },
    });
  }

  loadCollaborators(): void {
    this.UserService.GetAllUsers().subscribe({
      next: (res: any) => {
        if (Array.isArray(res.Data)) {
          this.collaborators = res.Data.filter(
            (collaborator: User) => collaborator.useId !== this.user?.useId
          );
        } else {
          console.error('La respuesta no es un array de usuarios.');
        }
      },
      error: (error: any) => {
        console.error(error, 'No se pudieron cargar los colaboradores');
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

  addCollaborator(): void {
    if (this.selectedCollaborator) {
      const newCollaborator: Collaborator = {
        colId: 0,
        entry: this.dailyLog!.entry,
        user: this.selectedCollaborator,
      };

      this.addCollaboratorToNewEntry(newCollaborator);
    }
  }

  deleteCategoryEntry(catEntId: number){

    this.CategoriesEntryService.deleteCategoryEntry(catEntId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.loadCategoriesEntry(this.dailyLog!.entry.entId);
      },
      error: (error: any) => {
        console.log(error, 'No se pudieron cargar las categorias');
      },
    });

  }

  loadCategoriesEntry(entId: number){

    this.CategoriesEntryService.getAllCategoriesEntry(entId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.CategoriesEntry = res.Data;
        console.log(this.CategoriesEntry);
      },
      error: (error: any) => {
        console.log(error, 'No se pudieron cargar las categorias');
      },
    });
  }
  addCategoryEntry():void{
    if(this.selectedCategory){
      const newCategoryEntry: CategoriesEntry = {
        catEntStatus: true,
        catEntId: 0,
        category: this.selectedCategory,
        entry: this.dailyLog!.entry
      };
      this.addCategoryToNewEntry(newCategoryEntry);
      
    }
  }

  private createDefaultEntry(): void {
    const newData: DailyLogCreate = {
      useId: this.user!.useId,
      emoStaId: this.emotionalState,
      entText: "Nota",
      entTitle: this.title,
    };
    console.log(newData);
    this.dailyLogService.createDailyLog(newData).subscribe({
      next: (response: any) => {
        this.dailyLog = response.Data;
        console.log(this.dailyLog);
        console.log('Nueva entrada creada con ID:', this.dailyLog);
      },
      error: (error: any) => {
        console.error('Error al crear la entrada:', error);
      },
    });
  }

  private addCollaboratorToNewEntry(collaborator: Collaborator): void {
    console.log(collaborator)
    this.CollaboratorService.createCollaborator(collaborator).subscribe({
      next: (response: any) => {
        console.log('Colaborador añadido exitosamente:', response);
        this.alertService.showAlert(
          'Colaborador agregado',
          'El colaborador se ha añadido a tu entrada.',
          'success'
        );
      },
      error: (error: any) => {
        if (error.status === 400) {
          console.error('Error al añadir colaborador:', error);
          this.alertService.showAlert(
            'Error al añadir colaborador',
            error.error.Data, 
            'error'
          );
        } else {
          console.error('Error inesperado al añadir colaborador:', error);
          this.alertService.showAlert(
            'Error al añadir colaborador',
            'Hubo un problema al añadir el colaborador a tu entrada.',
            'error'
          );
        }
      },
    });
  }


  private addCategoryToNewEntry(CategoriesEntry: CategoriesEntry): void {
    console.log(CategoriesEntry)
    this.CategoriesEntryService.createCategoryEntry(CategoriesEntry).subscribe({
      next: (response: any) => {
        this.loadCategoriesEntry(this.dailyLog!.entry.entId);
        console.log('Etiqueta añadida exitosamente:', response);
        this.alertService.showAlert(
          'Etiqueta agregada',
          'La Etiqueta se ha añadido a tu entrada.',
          'success'
        );
      },
      error: (error: any) => {
        if (error.status === 400) {
          console.error('Error al añadir Etiqueta:', error);
          this.alertService.showAlert(
            'Error al añadir Etiqueta',
            error.error.Data, 
            'error'
          );
        } else {
          console.error('Error inesperado al añadir Etiqueta:', error);
          this.alertService.showAlert(
            'Error al añadir Etiqueta',
            'Hubo un problema al añadir la Etiqueta a tu entrada.',
            'error'
          );
        }
      },
    });
  }
}
