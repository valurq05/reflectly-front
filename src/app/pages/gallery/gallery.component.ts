import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../core/services/image.service';
import { GalleryService } from '../../core/services/gallery.service';
import { Photo, User } from '../../core/model/common.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit{

  Photos: Photo[] = [];
  user: User | null = null;
  selectedPhoto: Photo | null = null; 
  photoDescription:string = 'No ';
  loading:boolean = true;

  constructor(
    private imageService_: GalleryService,
    private authService: AuthService)
    {}

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();
    console.log("id del usuario para galería:" + this.user?.useId)
    this.loadUserPhotos(this.user?.useId);
  }

  loadUserPhotos(userId: any) {
    this.imageService_.getUserPhotos(userId).subscribe(response => {
      this.Photos = response;
      console.log("Fotos con fullPath:", this.Photos);
    });
  }

  onPhotoClick(photo: Photo) {
    this.selectedPhoto = photo;
    console.log("ruta de archivo para ia: " + photo.rutaArchivo);

    this.imageService_.getImageDescription(photo.rutaArchivo).subscribe(response => {
        if (response) {
            this.photoDescription = response.clasificacion.predictions
                .map(prediction => prediction.label)
                .join(", "); 
                this.loading = false;
        } else {
            this.photoDescription = "No se encontraron predicciones.";
        }
    });
  }

  clearModal() {
    this.selectedPhoto = null;
    this.photoDescription = '';
    this.loading = true;
  }


}
