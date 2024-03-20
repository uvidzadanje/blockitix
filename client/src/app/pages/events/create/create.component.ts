import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AlertService } from 'src/app/components/parts/alert/alert.service';
import { BlockitixContractService } from 'src/app/shared/services/blockitix-contract.service';
import { EventService } from 'src/app/shared/services/event.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { StaticDataService } from 'src/app/shared/services/static-data.service';
import { IPFSService } from 'src/app/shared/services/ipfs.service';
import { DateValidator } from 'src/app/shared/validators/date.validator';
import { SeatGeneratorComponent } from '../../seat-generator/seat-generator.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    datetime: new FormControl(new Date().toISOString().substring(0, 16), [
      Validators.required,
      DateValidator.GreaterThanToday,
    ]),
    city: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    cover: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    category: new FormControl('', [Validators.required]),
  });

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '200px',
    minHeight: '0',
    maxHeight: '200px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter description here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    sanitize: false,
    toolbarPosition: 'top',
  };

  coverImageSrc?: string;

  cities?: string[];
  eventCategories?: string[];

  @ViewChild('generator', { read: SeatGeneratorComponent })
  generator?: SeatGeneratorComponent;

  async create() {
    this.loadingService.enableLoading();

    this.blockitixContractService.onEvent("EventCreated", (eventId) => {
      this.loadingService.disableLoading();
      this.alertService.alert$.next({type: "success", message: "Successfully created event!"});
      this.router.navigate(["event", eventId]);
    });

    let { name, datetime, city, location, cover, category, description } =
      this.form.value;
    let { layouts, types } = this.generator!;
    await this.eventService.createEvent({
      name,
      datetime,
      city,
      location,
      category,
      seatTypes: types,
      totalTickets: layouts.reduce(
        (acc, layout) => acc + layout.columns * layout.rows,
        0
      ),
      seatsFormatURL: `${await this.uploadService.upload(JSON.stringify(layouts))}`,
      isCanceled: false,
      coverURL: `${await this.uploadService.upload(cover)}`,
      descriptionURL: `${await this.uploadService.upload(description)}`,
    });
  }

  constructor(
    private eventService: EventService,
    private uploadService: IPFSService,
    private staticDataService: StaticDataService,
    private loadingService: LoadingService,
    private blockitixContractService: BlockitixContractService,
    private alertService: AlertService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.cities = (await this.staticDataService.getCities())?.map(
      (city) => city.name
    );
    this.eventCategories = (
      await this.staticDataService.getEventCategories()
    )?.map((city) => city.name);
  }

  onFileChange(event: Event) {
    let file = (event.target as HTMLInputElement).files![0];

    const reader = new FileReader();

    reader.onload = (e) => (this.coverImageSrc = reader.result as string);

    reader.readAsDataURL(file);

    this.form.patchValue({ cover: file });
  }
}
