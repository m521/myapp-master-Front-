import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ParkingService } from 'src/app/Service/parking.service';
import { PlaceParkingService } from 'src/app/Service/place-parking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-place-parking',
  templateUrl: './place-parking.component.html',
  styleUrls: ['./place-parking.component.css'],
})
export class PlaceParkingComponent {
  id!: any;
  placeParkingToedit: number = 0;
  userId: any;
  parking: any = {};
  placeParkings: any[] = [];
  place: any = {};
  placeReservee: any;
  adminCheck: boolean = false;
  date!: any;
  placeParkingId: any;
  userEmail: string = '';
  constructor(
    private route: ActivatedRoute,
    private pPService: ParkingService,
    private placeParkingService: PlaceParkingService
  ) {
    this.userEmail = localStorage.getItem('email') as string;
    localStorage.getItem('role') == 'Admin' ? (this.adminCheck = true) : false;
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.id = params['id'];
    });
  }
  // Initialisation du formulaire de modification de place
  formulaire: FormGroup = new FormGroup({
    status: new FormControl('', [Validators.required]),
  });
  // Initialisation du formulaire de réservation de place
  formul: FormGroup = new FormGroup({
    start_date: new FormControl('', [Validators.required]),
    end_date: new FormControl('', [Validators.required]),
    userIdAff: new FormControl(''),
    placeID: new FormControl(''),
  });

  affectertout: FormGroup = new FormGroup({
    start_date: new FormControl('', [Validators.required]),
    end_date: new FormControl('', [Validators.required]),
  });

  // Méthodes getter pour accéder facilement aux champs du formulaire
  get startt_date() {
    return this.affectertout.get('start_date');
  }
  get endt_date() {
    return this.affectertout.get('end_date');
  }
  get start_date() {
    return this.formul.get('start_date');
  }
  get end_date() {
    return this.formul.get('end_date');
  }

  get userIdAff() {
    return this.formul.get('userIdAff');
  }
  get placeID() {
    return this.formul.get('placeID');
  }

  // Méthode pour gérer la soumission du formulaire de réservation
  bookForm() {
    const parking = {
      startDate: this.start_date?.value as Date,
      endDate: this.end_date?.value as Date,
    };
    this.placeParkingService.book(this.placeParkingToedit, parking).subscribe(
      () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Reservation éffectuée avec succés',
          showConfirmButton: false,
          timer: 3000,
        });
        window.location.reload();
      },
      (error: any) => {
        Swal.fire('Oops', 'Reservation non éffectuée', 'error');
      }
    );
  }

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit() {
    this.pPService.getById(this.id).subscribe((res: any) => {
      console.log(res);
      this.parking = res;
      this.placeParkings = res.placeparkings;
      console.log(this.parking);
    });
  }

  // Méthode pour ouvrir le modèle de modification de place
  openModel(parking: any) {
    console.log(parking);
    this.place = {
      id: parking.id,
      status: parking.status,
    };

    console.log(this.place);
  }

  // Méthode pour modifier les informations de la place de parking
  modifyPlaceParkings(f: NgForm) {
    this.placeParkingService
      .modify(this.parking.id, this.place)
      .subscribe((res) => {
        console.log(res);
        this.ngOnInit();
      });
  }

  // Méthode pour supprimer une place de parking
  deletePlaceParking(id: any) {
    this.placeParkingService.delete(id).subscribe((res) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Suppression éffectuée avec succés',
        showConfirmButton: false,
        timer: 3000,
      });
      this.ngOnInit();
    });
  }

  // Méthode pour créer une nouvelle place de parking
  createPlaceParking() {
    const newPlace = {
      status: false,
      startDate: null,
      reservation: null,
      endDate: null,
      user: null,
    };
    this.placeParkingService.create(newPlace, this.id).subscribe(
      (res: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Création avec succés',
          showConfirmButton: false,
          timer: 3000,
        });
        window.location.reload();
      },
      (error) => {
        Swal.fire('Oops', 'Veuillez vérifier les champs', 'error');
      }
    );
  }

  // Méthode pour affecter toutes les places pour une période donnée
  affecter() {
    const parking = {
      startDate: this.startt_date?.value as Date,
      endDate: this.endt_date?.value as Date,
    };
    console.log(parking);
    this.placeParkingService.reserverAll(parking).subscribe((res) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Affectation éffectuée avec succés',
        showConfirmButton: false,
        timer: 3000,
      });
      window.location.reload();
    });
  }

  // Méthode pour réserver une place pour une personne spécifique
  ReserverPersonne() {
    const parking = {
      startDate: this.start_date?.value as Date,
      endDate: this.end_date?.value as Date,
    };
    this.placeParkingService
      .ReserverPersonne(this.placeID?.value, parking, this.userIdAff?.value)
      .subscribe((res: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Affectation éffectuée avec succés',
          showConfirmButton: false,
          timer: 3000,
        });
        window.location.reload();
      });
  }

  // Méthode pour annuler la réservation d'une place
  cancelReservation(placeId: number) {
    this.placeParkingService.cancelReserver(placeId).subscribe(() => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Annulation éffectuée avec succés',
        showConfirmButton: false,
        timer: 3000,
      });
      window.location.reload();
    });
  }
}
