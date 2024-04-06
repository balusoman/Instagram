import { Dialog } from '@angular/cdk/dialog';
import {  HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { ErrorComponent } from './components/error/error.component';


export const ErrorInterceptor:HttpInterceptorFn = (req,next) => {

  const dailog = inject(MatDialog)

    return next(req).pipe(
      catchError((error:HttpErrorResponse) =>{
        console.log(error)
        let errorMessage = "An unknown error occurred!"
        if(error.error.message){
          errorMessage = error.error.message
        }
        dailog.open(ErrorComponent,{data:{message:errorMessage}})
        return throwError(() => error);
      }
    ))
}

