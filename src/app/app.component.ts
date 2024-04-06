import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { FeedComponent } from './components/feed/feed.component';
import { AuthService } from './components/auth/auth.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, SidebarComponent,FeedComponent,MatDialogModule],
})
export class AppComponent implements OnInit{
    constructor(private authService:AuthService,public dialog: MatDialog) {}

    ngOnInit(){
        this.authService.autoAuthUser();
    } 
      

}
