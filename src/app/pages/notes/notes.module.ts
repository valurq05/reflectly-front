import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateNoteComponent } from './create-note/create-note.component';
import { NotesComponent } from './notes/notes.component';




@NgModule({
  declarations: [
   
    CreateNoteComponent,
        NotesComponent,

  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class NotesModule { }
