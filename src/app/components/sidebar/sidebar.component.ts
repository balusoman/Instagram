import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink,RouterLinkActive, } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from 'express';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy{

userIsAuthenticated = false;
private authListenerSubs:any;

  constructor(private authService:AuthService) {}
   
  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();
   this.authListenerSubs =  this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }


  logOut(){
    this.authService.logOut()
  }
}
