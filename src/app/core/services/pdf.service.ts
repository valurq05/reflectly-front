import { Injectable } from '@angular/core';
// @ts-ignore
import html2pdf from 'html2pdf.js';

import { DailyLog } from '../model/common.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generatePdf(dailyLog: DailyLog) {
    const container = document.createElement('div');
  
    container.innerHTML = `
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f7fa;
          margin: 0;
          padding: 20px;
          color: #333;
        }
  
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
  
        .header h1 {
          font-size: 28px;
          color: #5a2d82;
          margin: 0;
          letter-spacing: 1px;
        }
  
        .header hr {
          border: 1px solid #5a2d82;
          margin: 10px 0;
        }
  
        .profile-info {
          margin-bottom: 20px;
        }
  
        .profile-info h3 {
          font-size: 18px;
          color: #333;
        }
  
        .profile-info p {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
        }
  
        .note-section {
          margin-top: 30px;
        }
  
        .note-card {
          background-color: #ffffff;
          padding: 15px;
          margin-top: 15px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-left: 6px solid #5a2d82;
        }
  
        .note-card p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
  
        .footer {
          margin-top: 40px;
          text-align: right;
          font-style: italic;
          font-size: 12px;
          color: #888;
        }
  
        .footer p {
          margin: 0;
        }
  
        .note-section h3 {
          color: #5a2d82;
          font-size: 18px;
          margin-bottom: 10px;
        }
  
        .note-card strong {
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Reporte de Nota</h1>
        <hr>
        <p style="font-style: italic;">Fecha: ${new Date(dailyLog.dayLogDate).toLocaleDateString()}</p>
      </div>
  
      <div class="profile-info">
        <h3>Detalles de la Entrada:</h3>
        <p><strong>Nombre:</strong> ${dailyLog.emotionalLog.user.person.perName} ${dailyLog.emotionalLog.user.person.perLastname}</p>
        <p><strong>Título:</strong> ${dailyLog.entry.entTitle}</p>
        <p><strong>Texto:</strong> ${dailyLog.entry.entText}</p>
      </div>
  
      <div class="note-section">
        <h3>Estado Emocional:</h3>
        <div class="note-card">
          <p><strong>Estado:</strong> ${dailyLog.emotionalLog.emotionalState.emoStaState}</p>
        </div>
      </div>
  
      <div class="footer">
        <p>Reporte generado automáticamente.</p>
      </div>
    </body>
    </html>
    `;
  
    const options = {
      margin: 1,
      filename: 'reporte.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
    };
  
    html2pdf().set(options).from(container).save();
  }
}

