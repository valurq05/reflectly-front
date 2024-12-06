import { AfterViewInit, Component } from '@angular/core';
import Quill from 'quill';
@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.css'
})
export class CreateNoteComponent implements AfterViewInit 
{

  title:string ="Titulo"
  editor: Quill | undefined;

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

    console.log(this.title)
    console.log(this.getContent())
  }
  
}
