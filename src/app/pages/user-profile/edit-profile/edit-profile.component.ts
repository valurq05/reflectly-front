import { Component, ElementRef, ViewChild } from '@angular/core';
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

  document: string | null = null;
  name: string | null = null;

  lastName: string | null = null;
  photo: string | null = null;
  selectedFile: File | null = null;

  previewImageUrl: string | null = null;

  constructor(private authService: AuthService,
    private imageService: ImageService,
    private personService: PersonService,
  private alertService:AlertServiceService) { }

  ngOnInit() {
    this.user = this.authService.getUserInfo();
    if (this.user) {

      this.name = this.user.person.perName
      this.lastName = this.user.person.perLastname
      this.document = this.user.person.perDocument
      this.photo = this.user.person.perPhoto

    }
  }
  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(this.modalElement.nativeElement)
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.user) {
      this.selectedFile = file;
      this.previewImageUrl = URL.createObjectURL(file);
      console.log("selected")
    } else {
      this.previewImageUrl = null;

    }
  }

  deleteSelectedPhtot(fileInput: HTMLInputElement) {
    this.previewImageUrl = null
    this.selectedFile = null
    fileInput.value = ""
  }
  onUpdateUser() {

    if (this.user && this.name && this.document && this.lastName) {

      if (this.selectedFile) {
        try {
          this.imageService.updateProfilePhoto(this.selectedFile, this.user.useId).subscribe({
            next: (res) => {
              console.log(res)

            }, error: (error) => {
              console.log(error, "Hola, no funciona")
            }
          })
        }
        catch (e) {

          console.log(e, "Hola, no funciona")

        }
      }



      try {
        let data: UpdatePerson | Person;

        //determinar si se debe actualizar la foto o debe quedar la actual,
        //ya que el back recibe una entidad personalbar, y en caso de que esta imagen no sea actualizada  
        //y tampoco se le pase  como porpiedad el campo quedara en null 
        //por esto si la foto no se actualzia se debe apsar la actual
        if (this.selectedFile) {
          data = {
            perId: this.user.person.perId,
            perDocument: this.document,
            perLastname: this.lastName,
            perName: this.name,
          } as UpdatePerson;
        } else {
          data = {
            perId: this.user.person.perId,
            perDocument: this.document,
            perLastname: this.lastName,
            perName: this.name,
            perPhoto: this.user.person.perPhoto,
          } as Person;
        }


        this.personService.updatePerson(data).subscribe({
          next: (res) => {
            console.log(res)
            this.modal.hide();
            this.alertService.showAlert("Usuario actualizado",":D", "success")

            setTimeout(()=>{

              this.authService.logout()
            },1500)

          }, error: (error) => {
            console.log(error, "Hola, no funciona")
          }
        })
      }
      catch (e) {
        console.log(e, "Hola, no funciona")
      }

    }

  }
}
