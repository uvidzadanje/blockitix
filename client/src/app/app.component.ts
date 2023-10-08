import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertService } from './components/parts/alert/alert.service';
import { Web3Service } from './shared/services/web3.service';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from './components/parts/alert/alert.component';
import { LoadingService } from './shared/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';

  alert$: Subject<string>;
  isLoading: boolean = false;

  constructor(alertService: AlertService, private web3Service: Web3Service, private dialog: MatDialog, private loadingService: LoadingService)
  {
    this.alert$ = alertService.alert$;
  }

  async ngOnInit(): Promise<void> {
    this.alert$.subscribe((data) => {
      this.dialog.open(AlertComponent, {
        data: {
          message: data
        }
      });
    });

    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    })
  }

}
