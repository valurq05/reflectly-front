import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person, UpdatePerson, User } from '../../../core/model/common.model';
import { AlertServiceService } from '../../../core/services/alert-service.service';
import { AuthService } from '../../../core/services/auth.service';
import { ImageService } from '../../../core/services/image.service';
import { PersonService } from '../../../core/services/person.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  @ViewChild('editProfileModal', { static: false }) modalElement!: ElementRef;

  modal!: any;
  user: User | null = null;

  editProfileForm!: FormGroup;
  selectedFile: File | null = null;
  previewImageUrl: string | null  |ArrayBuffer= null;
  selectedFileError: string | null = null;

  constructor(private authService: AuthService,
    private imageService: ImageService,
    private personService: PersonService,

    private fb: FormBuilder,
    private alertService: AlertServiceService) { }

  ngOnInit() {
    this.user = this.authService.getUserInfo();

    this.editProfileForm = this.fb.group({
      document: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      photo: [null]
    });
    if (this.user) {
      this.editProfileForm.patchValue({
        document: this.user.person.perDocument,
        name: this.user.person.perName,
        lastName: this.user.person.perLastname
      });
    }
  }
  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(this.modalElement.nativeElement)
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.selectedFileError = 'Por favor selecciona una imagen válida.';
        this.clearFileInput(input);
        return;
      }

      const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSizeInBytes) {
        this.selectedFileError = 'El tamaño de la imagen no debe superar los 2 MB.';
        this.clearFileInput(input);
        return;
      }

      this.selectedFileError = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  clearFileInput(input: HTMLInputElement): void {
    input.value = '';
  }
  deleteSelectedPhoto(fileInput: any): void {
    this.selectedFile = null;
    this.previewImageUrl = null;
    fileInput.value = null;
  }

  onUpdateUser(): void {
    if (this.user) {
      if (this.editProfileForm.invalid) {
        this.alertService.showAlert("Formulario inválido", "Por favor, corrige los errores", "error");
        return;
      }

      const { document, name, lastName } = this.editProfileForm.value;

      try {
        let data: UpdatePerson | Person;

        if (this.selectedFile) {
          data = {
            perId: this.user.person.perId,
            perDocument: document,
            perLastname: lastName,
            perName: name
          } as UpdatePerson;

          this.imageService.updateProfilePhoto(this.selectedFile, this.user.useId).subscribe({
            next: (res) => console.log(res),
            error: (error) => console.error(error, "Error al subir la foto")
          });
        } else {
          data = {
            perId: this.user.person.perId,
            perDocument: document,
            perLastname: lastName,
            perName: name,
            perPhoto: this.user.person.perPhoto
          } as Person;
        }

        this.personService.updatePerson(data).subscribe({
          next: () => {
            this.alertService.showAlert("Usuario actualizado", ":D", "success");
            setTimeout(() => this.authService.logout(), 1500);
            this.modal.hide()
          },
          error: (error) => console.error(error, "Error al actualizar usuario")
        });
      } catch (e) {
        console.error(e, "Error inesperado");
      }
    }
  }
}
