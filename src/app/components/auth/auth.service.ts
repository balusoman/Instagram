import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';


const BACKEND_URL = environment.apiUrl + '/user/';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = false;
  private token!:string;
  private tokenTimer:any;
  private authStatusListener = new Subject<boolean>();
  userId!:any;

  constructor(private http:HttpClient,private router:Router) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email:string,password:string){
    console.log(BACKEND_URL)
    const authData: AuthData = {email:email,password:password} 
    this.http.post( BACKEND_URL + 'signup',authData)
    .subscribe(response=>{
      console.log(response)
      this.router.navigate(['/login']);
    }
  )
  } 

  login(email: string, password: string) {
    console.log(email)
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string,expiresIn:number,userId:string }>(BACKEND_URL+'login', authData)
      .subscribe(response => {
        console.log(response)
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = this.setAuthTimer(expiresInDuration)
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now= new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate,this.userId);
          this.router.navigate(['/feed']);
        }
      });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn>0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);
    }
  }

  

  logOut(){
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration:number){
    // console.log("Setting timer: "+duration);
    this.tokenTimer = setTimeout(()=>{
      this.logOut();
    },duration*1000);
  }

  private saveAuthData(token:string,expirationDate:Date,userId?:any){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    if(userId){
      localStorage.setItem('userId',userId);
    }
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate){
      return;
    }
    return {
      token:token,
      expirationDate: new Date(expirationDate),
      userId:userId
    }
  }
}
