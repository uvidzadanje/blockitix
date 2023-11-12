import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { EventAuthGuardService } from './auth/event-auth-guard.service';
import { RegisterComponent } from './pages/auth/register/register.component';
import { EventShowComponent } from './pages/event-show/event-show.component';
import { CreateComponent } from './pages/events/create/create.component';
import { EditEventComponent } from './pages/events/edit-event/edit-event.component';
import { EventsComponent } from './pages/events/events.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SeatGeneratorComponent } from './pages/seat-generator/seat-generator.component';
import { TicketValidationComponent } from './pages/ticket/ticket-validation/ticket-validation.component';
import { Role } from './shared/models/user';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "events",
    component: EventsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "generator",
    component: SeatGeneratorComponent
  },
  {
    path: "event/create",
    component: CreateComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [Role.CREATOR]
    }
  },
  {
    path: "event/edit/:id",
    component: EditEventComponent,
    canActivate: [AuthGuardService, EventAuthGuardService],
    data: {
      roles: [Role.CREATOR]
    }
  },
  {
    path: "event/:id",
    component: EventShowComponent
  },
  {
    path: "ticket/:id",
    component: TicketValidationComponent
  },
  {
    path: "**",
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
