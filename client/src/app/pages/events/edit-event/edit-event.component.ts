import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AlertService } from 'src/app/components/parts/alert/alert.service';
import { Event as EventEntity } from 'src/app/shared/models/event';
import { BlockitixContractService } from 'src/app/shared/services/blockitix-contract.service';
import { EventService } from 'src/app/shared/services/event.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { StaticDataService } from 'src/app/shared/services/static-data.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { DateValidator } from 'src/app/shared/validators/date.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    datetime: new FormControl(new Date().toISOString().substring(0, 16), [Validators.required, DateValidator.GreaterThanToday]),
    city: new FormControl("", [Validators.required]),
    location: new FormControl('', [Validators.required]),
    cover: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    category: new FormControl("", [Validators.required])
  })

  event?: EventEntity;
  coverImageSrc?: string;

  cities?: string[];
  eventCategories?: string[];

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
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    sanitize: false,
    toolbarPosition: 'top'
  };

  constructor(
    private eventService: EventService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,
    private staticDataService: StaticDataService,
    private loadingService: LoadingService,
    private blockitixContractService: BlockitixContractService,
    private alertService: AlertService
  ) { }

  async ngOnInit(): Promise<void> {
    let id = this.route.snapshot.paramMap.get('id');

    if(!id)
    {
      this.router.navigate([""]);
      return;
    }

    this.cities = (await this.staticDataService.getCities())?.map(city => city.name);
    this.eventCategories = (await this.staticDataService.getEventCategories())?.map(category => category.name);

    this.event = (await this.eventService.getOneEvent(BigInt(+id)))!;
    this.coverImageSrc = this.event.coverURL;

    let image = await (await fetch(this.coverImageSrc)).blob();

    this.form.patchValue({cover:image, name: this.event.name, datetime: this.event.datetime, city: this.event.city, location: this.event.location, description: await (await fetch(this.event.descriptionURL)).text(), category: this.event.category});
  }

  onFileChange(event: Event) {
    let file = (event.target as HTMLInputElement).files![0];

    const reader = new FileReader();

    reader.onload = (e) => this.coverImageSrc = (reader.result as string);

    reader.readAsDataURL(file);

    this.form.patchValue({cover: file});
  }

  async edit() {
    this.loadingService.enableLoading();
    this.blockitixContractService.onEvent("EventUpdated", (eventId) => {
      this.loadingService.disableLoading();
      this.alertService.alert$.next({type: "success", message: "Event updated!"});
      this.router.navigate([`event/${this.event?.id}`]);
    })
    await this.eventService.editEvent({
      id: this.event?.id,
      ...this.form.value,
      coverURL: `${environment.ipfsStorageURL}/${await this.uploadService.upload(this.form.value.cover)}`,
      descriptionURL: `${environment.ipfsStorageURL}/${await this.uploadService.upload(this.form.value.description)}`
    })
  }
}
