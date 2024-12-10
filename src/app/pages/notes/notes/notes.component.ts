import { Component, OnInit } from '@angular/core';
import { DailyLogService } from '../../../core/services/daily-log.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/model/common.model';
import { PdfService } from '../../../core/services/pdf.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent implements OnInit{

  user: User | null = null;
  categories:any[] = [];
  selectedDate: Date | null = null
  entries: any[] = [];
  colors = ['#C06EF3', '#6DCBFF', '#FFBB6D'];

  constructor(
    private userNotesService: DailyLogService,
    private authService: AuthService,
    private pdfService: PdfService){}

  ngOnInit(): void {
    this.readUserNotes();
  }

  private readUserNotes(){
    this.user = this.authService.getUserInfo();
    if (this.user?.useId) {
       this.userNotesService.getDailyUserLogs(this.user.useId).subscribe(response => {
       if (response.Status) {
         this.entries = response.Data;
         console.log(this.entries);
       }
       }
       );
    } else {
     console.log("No se encontraron datos del usuario");
    }
  }

  stripHtmlTags(html: string): string {
    return html.replace(/<\/?()[^>]+(>|$)/g, '');  
  }

    truncateText(text: string, limit: number): string {
      if (!text) return '';
    
  
      const htmlWithoutTags = this.stripHtmlTags(text);
      const imgIndex = htmlWithoutTags.indexOf('[IMG]');
      const truncatePoint = imgIndex >= 0 ? Math.min(imgIndex, limit) : limit;
  
      return htmlWithoutTags.length > truncatePoint ? htmlWithoutTags.substring(0, truncatePoint) + '...' : htmlWithoutTags;
    }

    onClickDeleteEntry(id: string){
      Swal.fire({title:"¿Seguro que deseas eliminar esta nota?", 
        text:"No podras recuperarla",
        icon:"warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"}).then((result)=>{
          if(result.isConfirmed){
            try{
              this.userNotesService.deleteEntry(id).subscribe({
                next:(response)=>{
                  console.log(response)
                  if(this.selectedDate){
                   
                  }
                }, error:(error)=>{
                  console.log(error)
        
                }
              })
            }
            catch(e){
              console.log(e)
            }
          }
      })
    }
  
    onGeneratePdf(idDailyLog: string){
  
      try{
        this.userNotesService.getDailyLog(idDailyLog).subscribe({
          next: (res)=>{
            console.log(res.Data)
            
            this.pdfService.generatePdf(res.Data)
          },error: (error)=>{
            console.log(error, "Hola, no funciona")
          }
        })
      }
      catch(e){
  console.log(e)
      }
  
    }

    
  getEmojiForStatus(status: string): string {
    switch(status) {
      case 'Feliz/a':
        return '😊'; 
      case 'Triste/a':
        return '😞';
      case 'Enojado/a':
        return '😡'; 
      case 'Neutral/a':
        return '😐';
      case 'Sorpresa/a':
        return '😲';
      case 'Amor/a':
        return '❤️';
      case 'Miedo/a':
        return '😨';
      case 'Confundido/a':
        return '🤔';
      case 'Avergonzado/a':
        return '😳';
      case 'Orgulloso/a':
        return '😎';
      case 'Cansado/a':
        return '😴';
      case 'Nervioso/a':
        return '😬';
      case 'Frustrado/a':
        return '😤';
      case 'Desinteresado/a':
        return '😒';
      case 'Relajado/a':
        return '😌';
      case 'Ansioso/a':
        return '😟';
      case 'Aburrido/a':
        return '😑';
      case 'Inspirado/a':
        return '✨';
      default:
        return ''; 
    }
  }

  formattedDay(date:Date|null){

    if (date){
      return date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
    else return "date"
    
  }
  }
