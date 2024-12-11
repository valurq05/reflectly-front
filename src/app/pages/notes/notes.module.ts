import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateNoteComponent } from './create-note/create-note.component';
import { NotesComponent } from './notes/notes.component';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
   
    CreateNoteComponent,
        NotesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class NotesModule { }
