import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';
import { RegisterComponent } from './pages/auth/register/register.component';
import { EventsComponent } from './pages/events/events.component';
import { SeatGeneratorComponent } from './pages/seat-generator/seat-generator.component';

const routes: Routes = [
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
