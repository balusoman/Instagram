import {  HttpInterceptorFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';


export const AuthInterceptor:HttpInterceptorFn = (req,next) => {

  const authService = inject(AuthService);
  const authToken = authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    // console.log(authRequest,"auth_request")
    return next(authRequest);
}

