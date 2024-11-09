import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username?: string;

  constructor(private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    this.username = (await this.authService.getAuthUser())?.username;
    console.log(this.username);
  }

}
