import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { DailyLog } from '../model/common.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generatePdf(dailyLog: DailyLog) {
    const doc = new jsPDF();
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
  
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Reporte de Nota', pageWidth / 2, margin + 10, { align: 'center' });
  
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 15, pageWidth - margin, margin + 15);
  
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(dailyLog.dayLogDate).toLocaleDateString()}`, margin, margin + 25);
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('Detalles de la Entrada:', margin, margin + 40);
  
    doc.setFontSize(12);
    doc.text(`Título: ${dailyLog.entry.entTitle}`, margin, margin + 50);
    doc.text(`Texto:`, margin, margin + 60);
    doc.text(dailyLog.entry.entText, margin + 10, margin + 70, { maxWidth: pageWidth - margin * 2 });
  
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Estado Emocional:', margin, margin + 100);
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Estado: ${dailyLog.emotionalLog.emotionalState.emoStaState}`, margin, margin + 110);
  
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('Reporte generado automáticamente.', margin, doc.internal.pageSize.height - margin - 10);
  
    doc.save('reporte.pdf');
  }
  
}
