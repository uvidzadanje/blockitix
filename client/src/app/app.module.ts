import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { NavbarComponent } from './components/parts/navbar/navbar.component';
import { FooterComponent } from './components/parts/footer/footer.component';
import { AlertComponent } from './components/parts/alert/alert.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { EventsComponent } from './pages/events/events.component';
import { EventComponent } from './pages/events/event/event.component';
import { MatCardModule } from '@angular/material/card';
import { CreateComponent } from './pages/events/create/create.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from '@angular/forms';
import { TicketComponent } from './pages/event-show/ticket/ticket.component';
import { LoadingComponent } from './components/parts/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegisterComponent } from './pages/auth/register/register.component';
import { SeatGeneratorComponent } from './pages/seat-generator/seat-generator.component';
import { MatStepperModule } from "@angular/material/stepper";
import { MatTooltipModule } from "@angular/material/tooltip";
import { EthParserPipe } from './shared/pipes/eth-parser.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EditEventComponent } from './pages/events/edit-event/edit-event.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { QRCodeModule } from 'angularx-qrcode';
import { TicketValidationComponent } from './pages/ticket/ticket-validation/ticket-validation.component';
import { EventShowComponent } from './pages/event-show/event-show.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HomeComponent } from './pages/home/home.component';
import { SafeHtmlPipe } from './shared/pipes/safe-html.pipe'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    AlertComponent,
    EventsComponent,
    EventComponent,
    CreateComponent,
    TicketComponent,
    LoadingComponent,
    RegisterComponent,
    SeatGeneratorComponent,
    EthParserPipe,
    EditEventComponent,
    NotFoundComponent,
    TicketValidationComponent,
    EventShowComponent,
    HomeComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    QRCodeModule,
    AngularEditorModule,
    HttpClientModule,
    MatTabsModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
