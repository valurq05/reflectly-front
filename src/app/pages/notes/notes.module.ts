import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateNoteComponent } from './create-note/create-note.component';
import { NotesComponent } from './notes/notes.component';
import { UpdateNoteComponent } from './update-note/update-note.component';



@NgModule({
  declarations: [
   
    CreateNoteComponent,
        NotesComponent,
        UpdateNoteComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class NotesModule { }
