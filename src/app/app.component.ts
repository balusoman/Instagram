import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { FeedComponent } from './components/feed/feed.component';
import { AuthService } from './components/auth/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './components/auth/auth.interceptor';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, SidebarComponent,FeedComponent],
})
export class AppComponent implements OnInit{
    constructor(private authService:AuthService) {}

    ngOnInit(){
        this.authService.autoAuthUser();
    }

}
