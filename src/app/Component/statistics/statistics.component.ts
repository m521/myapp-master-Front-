// Import des modules nécessaires depuis Angular et d'autres bibliothèques tierces
import { Component } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { PlaceParkingService } from 'src/app/Service/place-parking.service';
import { UserServiceService } from 'src/app/Service/user.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

// Définition des symboles SVG utilisés dans le graphique
const pathSymbols = {
  car: 'path://M49.592,40.883c-0.053,0.354-0.139,0.697-0.268,0.963c-0.232,0.475-0.455,0.519-1.334,0.475 c-1.135-0.053-2.764,0-4.484,0.068c0,0.476,0.018,0.697,0.018,0.697c0.111,1.299,0.697,1.342,0.931,1.342h3.7 c0.326,0,0.628,0,0.861-0.154c0.301-0.196,0.43-0.772,0.543-1.78c0.017-0.146,0.025-0.336,0.033-0.56v-0.01 c0-0.068,0.008-0.154,0.008-0.25V41.58l0,0C49.6,41.348,49.6,41.09,49.592,40.883L49.592,40.883z M6.057,40.883 c0.053,0.354,0.137,0.697,0.268,0.963c0.23,0.475,0.455,0.519,1.334,0.475c1.137-0.053,2.762,0,4.484,0.068 c0,0.476-0.018,0.697-0.018,0.697c-0.111,1.299-0.697,1.342-0.93,1.342h-3.7c-0.328,0-0.602,0-0.861-0.154 c-0.309-0.18-0.43-0.772-0.541-1.78c-0.018-0.146-0.027-0.336-0.035-0.56v-0.01c0-0.068-0.008-0.154-0.008-0.25V41.58l0,0 C6.057,41.348,6.057,41.09,6.057,40.883L6.057,40.883z M49.867,32.766c0-2.642-0.344-5.224-0.482-5.507 c-0.104-0.207-0.766-0.749-2.271-1.773c-1.522-1.042-1.487-0.887-1.766-1.566c0.25-0.078,0.492-0.224,0.639-0.241 c0.326-0.034,0.345,0.274,1.023,0.274c0.68,0,2.152-0.18,2.453-0.48c0.301-0.303,0.396-0.405,0.396-0.672 c0-0.268-0.156-0.818-0.447-1.146c-0.293-0.327-1.541-0.49-2.273-0.585c-0.729-0.095-0.834,0-1.022,0.121 c-0.304,0.189-0.32,1.919-0.32,1.919l-0.713,0.018c-0.465-1.146-1.11-3.452-2.117-5.269c-1.103-1.979-2.256-2.599-2.737-2.754 c-0.474-0.146-0.904-0.249-4.131-0.576c-3.298-0.344-5.922-0.388-8.262-0.388c-2.342,0-4.967,0.052-8.264,0.388 c-3.229,0.336-3.66,0.43-4.133,0.576s-1.633,0.775-2.736,2.754c-1.006,1.816-1.652,4.123-2.117,5.269L9.87,23.109 c0,0-0.008-1.729-0.318-1.919c-0.189-0.121-0.293-0.225-1.023-0.121c-0.732,0.104-1.98,0.258-2.273,0.585 c-0.293,0.327-0.447,0.878-0.447,1.146c0,0.267,0.094,0.379,0.396,0.672c0.301,0.301,1.773,0.48,2.453,0.48 c0.68,0,0.697-0.309,1.023-0.274c0.146,0.018,0.396,0.163,0.637,0.241c-0.283,0.68-0.24,0.524-1.764,1.566 c-1.506,1.033-2.178,1.566-2.271,1.773c-0.139,0.283-0.482,2.865-0.482,5.508s0.189,5.02,0.189,5.86c0,0.354,0,0.976,0.076,1.565 c0.053,0.354,0.129,0.697,0.268,0.966c0.232,0.473,0.447,0.516,1.334,0.473c1.137-0.051,2.779,0,4.477,0.07 c1.135,0.043,2.297,0.086,3.33,0.11c2.582,0.051,1.826-0.379,2.928-0.36c1.102,0.016,5.447,0.196,9.424,0.196 c3.976,0,8.332-0.182,9.423-0.196c1.102-0.019,0.346,0.411,2.926,0.36c1.033-0.018,2.195-0.067,3.332-0.11 c1.695-0.062,3.348-0.121,4.477-0.07c0.886,0.043,1.103,0,1.332-0.473c0.132-0.269,0.218-0.611,0.269-0.966 c0.086-0.592,0.078-1.213,0.078-1.565C49.678,37.793,49.867,35.408,49.867,32.766L49.867,32.766z M13.219,19.735 c0.412-0.964,1.652-2.9,2.256-3.244c0.145-0.087,1.426-0.491,4.637-0.706c2.953-0.198,6.217-0.276,7.73-0.276 c1.513,0,4.777,0.078,7.729,0.276c3.201,0.215,4.502,0.611,4.639,0.706c0.775,0.533,1.842,2.28,2.256,3.244 c0.412,0.965,0.965,2.858,0.861,3.116c-0.104,0.258,0.104,0.388-1.291,0.275c-1.387-0.103-10.088-0.216-14.185-0.216 c-4.088,0-12.789,0.113-14.184,0.216c-1.395,0.104-1.188-0.018-1.291-0.275C12.254,22.593,12.805,20.708,13.219,19.735 L13.219,19.735z M16.385,30.511c-0.619,0.155-0.988,0.491-1.764,0.482c-0.775,0-2.867-0.353-3.314-0.371 c-0.447-0.017-0.842,0.302-1.076,0.362c-0.23,0.06-0.688-0.104-1.377-0.318c-0.688-0.216-1.092-0.155-1.316-1.094 c-0.232-0.93,0-2.264,0-2.264c1.488-0.068,2.928,0.069,5.621,0.826c2.693,0.758,4.191,2.213,4.191,2.213 S17.004,30.357,16.385,30.511L16.385,30.511z M36.629,37.293c-1.23,0.164-6.386,0.207-8.794,0.207c-2.412,0-7.566-0.051-8.799-0.207 c-1.256-0.164-2.891-1.67-1.764-2.865c1.523-1.627,1.24-1.576,4.701-2.023C24.967,32.018,27.239,32,27.834,32 c0.584,0,2.865,0.025,5.859,0.404c3.461,0.447,3.178,0.396,4.699,2.022C39.521,35.623,37.887,37.129,36.629,37.293L36.629,37.293z  M48.129,29.582c-0.232,0.93-0.629,0.878-1.318,1.093c-0.688,0.216-1.145,0.371-1.377,0.319c-0.231-0.053-0.627-0.371-1.074-0.361 c-0.448,0.018-2.539,0.37-3.313,0.37c-0.772,0-1.146-0.328-1.764-0.481c-0.621-0.154-0.966-0.154-0.966-0.154 s1.49-1.464,4.191-2.213c2.693-0.758,4.131-0.895,5.621-0.826C48.129,27.309,48.361,28.643,48.129,29.582L48.129,29.582z',
};

// Options de l'étiquette pour la série pictorialBar
const labelSetting: echarts.PictorialBarSeriesOption['label'] = {
  show: true,
  position: 'right',
  offset: [10, 0],
  fontSize: 16,
};
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent {
  constructor(
    private placeService: PlaceParkingService,
    private userService: UserServiceService
  ) {
    this.CreateData();
    setTimeout(() => {
      this.createDiagram();
    }, 850);
  }

  placeParkingList: any[] = [];
  option: any;
  ngOnInit() {
    this.getHistory();
    console.log(this.listHistory);
  }

  // Récupération des données des places de parking
  CreateData() {
    this.placeService.get().subscribe((res: any) => {
      this.placeParkingList = res;
    });
  }
  // Conversion du contenu HTML en fichier PDF

  convetToPDF() {
    var data = document.getElementById('contentToConvert');
    if (data != null) {
      html2canvas(data).then((canvas) => {
        // Quelques options nécessaires
        var imgWidth = 208;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
        var position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('Rapport.pdf'); // Generated PDF
      });
    }
  }

  // Fonction qui crée un diagramme de parking
  createDiagram() {
    // Options du diagramme
    this.option = {
      title: {
        text: 'Parking', // Titre du diagramme
      },
      legend: {
        data: ['Toutes les places', 'Places disponibles'], // Légende du diagramme
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        containLabel: true,
        left: 20,
      },
      yAxis: {
        data: ['vehicules'], // Libellé de l'axe Y
        inverse: true,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          margin: 30,
          fontSize: 14,
        },
        axisPointer: {
          label: {
            show: true,
            margin: 30,
          },
        },
      },
      xAxis: {
        splitLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      series: [
        // Première série de données (Toutes les places)
        {
          name: 'Toutes les places',
          type: 'pictorialBar',
          label: labelSetting,
          symbolRepeat: true,
          symbolSize: ['80%', '60%'],
          barCategoryGap: '40%',
          data: [
            {
              value: this.placeParkingList.length, // Valeur de la première série (nombre total de places)
              symbol: pathSymbols.car, // Symbole utilisé pour représenter les places
            },
          ],
        },
        // Deuxième série de données (Places disponibles)
        {
          name: 'Places disponibles',
          type: 'pictorialBar',
          barGap: '10%',
          label: labelSetting,
          symbolRepeat: true,
          symbolSize: ['80%', '60%'],
          data: [
            {
              value: this.placeParkingList.filter((obj) => obj.status === false)
                .length, // Valeur de la deuxième série (nombre de places disponibles)
              symbol: pathSymbols.car, // Symbole utilisé pour représenter les places
            },
          ],
        },
      ],
    };
  }

  // Variable x de type string
  x: string = '';

  // Fonction qui obtient le nom d'utilisateur associé à un ID d'utilisateur
  getUsername(userId: any): Observable<string> {
    // Retourne une nouvelle Observable
    return new Observable<string>((observer) => {
      // Appelle la méthode getById du service utilisateur en utilisant l'ID fourni
      this.userService.getById(userId).subscribe(
        async (res: any) => {
          // En cas de succès de la requête
          // Concatène le prénom et le nom pour obtenir le nom complet
          this.x = (await res.firstName) + res.lastName;

          // Émet le nom d'utilisateur à travers l'Observable
          observer.next(this.x);

          // Termine l'Observable
          observer.complete();
        },
        (error) => {
          // En cas d'erreur lors de la requête
          // Émet l'erreur à travers l'Observable
          observer.error(error);
        }
      );
    });
  }

  // Déclaration d'une variable listHistory de type tableau any
  listHistory: any[] = [];

  // Fonction qui obtient l'historique des places
  getHistory() {
    // Appelle la méthode getHistory du service placeService
    this.placeService.getHistory().subscribe((res: any[]) => {
      // Utilise l'opérateur map pour transformer chaque élément de l'historique en un Observable
      const observables = res.map((element) => {
        // Pour chaque élément de l'historique, appelle la fonction getUsername pour obtenir le nom d'utilisateur
        return this.getUsername(element.user).pipe(
          // Utilise l'opérateur map pour transformer le résultat de getUsername
          map((username) => {
            // Ajoute la propriété 'name' à l'élément de l'historique avec le nom d'utilisateur obtenu
            element.name = username as string;
            // Retourne l'élément mis à jour
            return element;
          })
        );
      });

      // Utilise l'opérateur forkJoin pour combiner les observables dans le tableau 'observables'
      forkJoin(observables).subscribe((updatedElements) => {
        // La fonction de rappel subscribe est appelée une fois que toutes les observables sont complétées
        // 'updatedElements' contient les éléments avec les informations du nom d'utilisateur ajoutées

        // Parcours chaque élément mis à jour
        updatedElements.forEach((updatedElement) => {
          // Ajoute l'élément à la liste d'historique 'listHistory'
          this.listHistory.push(updatedElement);
        });
      });
    });
  }
}
