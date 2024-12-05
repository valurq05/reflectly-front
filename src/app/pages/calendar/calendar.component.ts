import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DailyLogService } from '../../core/services/daily-log.service';
import { User } from '../../core/model/common.model';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  currentYear!: number;
  currentMonth!: number;
  dates: Date[] = [];
  selectedDate: Date | null = null; 
  currentDate: Date = new Date();
  days: Array<{ date: Date; isCurrentMonth: boolean, emoji: string | null }> = [];
  User: User | null = null;
  token: string | null = null;
  weekDays: string[] = ['Dom','Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  @ViewChild('modalEntries') modalEntries: ElementRef | undefined;
  entries: any[] = [];
  
  constructor(private DailyLogService: DailyLogService, private AuthService: AuthService) {
  }

  ngOnInit(){
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonth = this.currentDate.getMonth();
    this.generateCalendar();
    this.User = this.AuthService.getUserInfo();
    this.token = this.AuthService.getAccessToken();
    if (this.User && this.User.useId && this.token) {
      console.log(this.token)
      this.DailyLogService.getDailyUserLogs(this.User.useId, this.token).subscribe(response => {
        if (this.User && this.User.useId && this.token) {
          console.log(this.token);
          this.loadLogs();
        } else {
          console.error('Usuario no encontrado o no válido');
        }
      });
    } else {
      console.error('Usuario no encontrado o no válido');
    }
  }

  generateCalendar() {
    this.days = []; 
    
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay(); 
    const lastDayOfWeek = lastDayOfMonth.getDay();  
  
 
    for (let i = firstDayOfWeek; i > 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth, 1 - i);
      date.setHours(0, 0, 0, 0);
      this.days.push({ date, isCurrentMonth: false, emoji: null });
    }
  

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      date.setHours(0, 0, 0, 0)
      this.days.push({ date, isCurrentMonth: true, emoji: null});
    }
  

    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, i);
      date.setHours(0, 0, 0, 0)
      this.days.push({ date, isCurrentMonth: false, emoji: null });
    }
  }

  loadLogs() {
    if (!this.User || !this.User.useId || !this.token) {
      console.error('Usuario no encontrado o no válido');
      return;
    }
    this.DailyLogService.getDailyUserLogs(this.User.useId, this.token).subscribe(response => {
      if (response && response.Status && Array.isArray(response.Data)) {
        this.processLogs(response.Data); 
      } else {
        console.error('No se encontraron registros válidos o la respuesta no tiene el formato esperado', response);
      }
    });
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar(); 
    this.loadLogs();
  }
  
  
  
  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar(); 
    this.loadLogs();
  }

  selectDate(date: Date) {
    if (date > this.currentDate) {
      console.log('Este día no puede ser seleccionado');
      return; 
    }
    this.selectedDate = date;
    const selectedDate = this.formatDateToString(date);
    console.log(selectedDate);
    this.getDailyLogsForDate(selectedDate);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isSelected(date: Date): boolean {
    return (
      this.selectedDate !== null && 
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  processLogs(logs: any[]) {

    const logsByDate: { [key: string]: any[] } = {};
  
    logs.forEach(log => {
      const logDate = new Date(log.dayLogDate);
      logDate.setMinutes(logDate.getMinutes() + logDate.getTimezoneOffset());
      const formattedDate = this.formatDateToString(logDate);
  
      if (!logsByDate[formattedDate]) {
        logsByDate[formattedDate] = [];
      }
      logsByDate[formattedDate].push(log);
    });
  
    for (const date in logsByDate) {
      const dailyLogs = logsByDate[date];
      const emotionCount: { [key: string]: number } = {};
  
      dailyLogs.forEach(log => {
        const emoji = this.getEmojiForStatus(log.emoStaState);
        if (emoji) {
          emotionCount[emoji] = (emotionCount[emoji] || 0) + 1;
        }
      });
  
      const mostFrequentEmoji = this.getMostFrequentEmotion(emotionCount);
  
   
      const day = this.days.find(d => this.formatDateToString(d.date) === date);
      if (day) {
        day.emoji = mostFrequentEmoji;
      }
    }
  
    console.log(this.days);
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

  getMostFrequentEmotion(emotionCount: { [key: string]: number }): string {
    let maxCount = 0;
    let mostFrequentEmoji = '';
  
    for (const emoji in emotionCount) {
      if (emotionCount[emoji] > maxCount) {
        maxCount = emotionCount[emoji];
        mostFrequentEmoji = emoji;
      }
    }

    return mostFrequentEmoji;
  }

  formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  getDailyLogsForDate(date: string) {
    if (!this.User || !this.User.useId || !this.token) {
      console.error('Usuario no encontrado o no válido');
      return;
    }
  
    this.DailyLogService.getDailyUserLogs(this.User.useId, this.token, date).subscribe(response => {
      if (response && response.Status && Array.isArray(response.Data) && response.Data.length > 0) {
        this.entries = response.Data;
        console.log('Entradas del día:', this.entries);
      } else {
        this.entries = [];
        console.log('No hay entradas para este día');
      }
    });
  }

  stripHtmlTags(html: string): string {
    return html.replace(/<\/?(?!br|p|ul|li|ol|a|img)[^>]+(>|$)/g, '');  
  }

    truncateText(text: string, limit: number): string {
      if (!text) return '';
    
  
      const htmlWithoutTags = this.stripHtmlTags(text);
      const imgIndex = htmlWithoutTags.indexOf('[IMG]');
      const truncatePoint = imgIndex >= 0 ? Math.min(imgIndex, limit) : limit;
  
      return htmlWithoutTags.length > truncatePoint ? htmlWithoutTags.substring(0, truncatePoint) + '...' : htmlWithoutTags;
    }
}

