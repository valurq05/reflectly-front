import { Component } from '@angular/core';
import { User } from '../../../core/model/common.model';
import { AuthService } from '../../../core/services/auth.service';
import { ImageService } from '../../../core/services/image.service';
import { LocalStorage } from '../../../core/constants.ts/constants';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  user: User | null = null;
  secretKey:string = 'TuClaveSecreta';

  constructor(
    private authService: AuthService,
    private ImageService: ImageService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    console.log(this.user);
    this.showUserImage();
  }

  showUserImage() {
    if (this.user) {
      let imageUrl = this.user.person.perPhoto;

      if (imageUrl.startsWith('https://lh3.googleusercontent.com')) {
        imageUrl = imageUrl.replace(/=s\d+-c/, '=s680-c');
        this.user.person.perPhoto = imageUrl;
        console.log(
          'Imagen de Google detectada, no se realizará ninguna acción:',
          imageUrl
        );
        return;
      }
      if (imageUrl.includes('/images/GdXyg8gWgAAQmW1.jpg')) {
        console.log(
          'Imagen por defecto encontrada, solicitando imagen por defecto'
        );
        this.ImageService.getDefaultImage().subscribe(
          (safeUrl: any) => {
            this.user!.person.perPhoto = safeUrl;
            console.log(
              'Imagen por defecto cargada correctamente:',
              this.user!.person.perPhoto
            );
          },
          (error: any) => {
            console.error('Error al cargar imagen por defecto:', error);
            this.user!.person.perPhoto =
              'http://localhost:8080/images/default-image';
          }
        );
      } else if (imageUrl) {
        console.log(
          'Conversión de URL relativa a absoluta exitosa:',
          this.user!.person.perPhoto
        );

        this.ImageService.showImage(this.user!.person.perPhoto).subscribe(
          (safeUrl: any) => {
            this.user!.person.perPhoto = safeUrl;
            console.log(
              'Imagen segura cargada para:',
              this.user!.person.perName + ' ' + this.user!.person.perPhoto
            );
          },
          (error: any) => {
            console.error(
              `Error al cargar la imagen para ${this.user!.person.perName}:`,
              error
            );
            this.user!.person.perPhoto =
              'http://localhost:8080/images/default-image';
          }
        );
      } else {
        this.user!.person.perPhoto =
          'http://localhost:8080/images/default-image';
      }
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById(
      'uploadImage'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const userId = this.user?.useId;

      if (userId) {
        this.ImageService.changeProfilePhoto(file, userId).subscribe(
          (response: any) => {
            console.log('Respuesta de actualización de imagen:', response.Data);
            console.log(response.Data);
            this.user!.person.perPhoto = response.Data;
            const encryptedUser = CryptoJS.AES.encrypt(
              JSON.stringify(this.user),
              this.secretKey
            ).toString();
            localStorage.setItem(LocalStorage.user, encryptedUser);
            this.showUserImage();
            console.log(
              'Imagen actualizada exitosamente:',
              this.user!.person.perPhoto
            );
          },
          (error: any) => {
            console.error(
              'Error en la solicitud de actualización de imagen:',
              error
            );
          }
        );
      } else {
        console.error('No se encontró el ID del usuario.');
      }
    }
  }

  // handleImageError() {
  //   this.ImageService.getDefaultImage().subscribe(
  //     (safeUrl: any) => {

  //       this.user!.person.perPhoto = safeUrl;
  //       console.log("Imagen por defecto cargada correctamente:", this.user!.person.perPhoto);
  //     },
  //     (error: any) => {
  //       console.error("Error al cargar imagen por defecto:", error);
  //       this.user!.person.perPhoto = 'http://localhost:8080/images/default-image';
  //     }
  //   );
  //   console.log('Se cargó la imagen por defecto debido a un error en la carga.');
  // }
}
