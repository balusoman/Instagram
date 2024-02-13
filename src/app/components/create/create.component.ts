import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [MatButtonModule,ReactiveFormsModule,FormsModule,MatInputModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {

  form!:FormGroup 

  constructor(public postService:PostsService){}



  
  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onSavePost(){

     if(this.form.valid){
      console.log(this.form.value)
      this.postService.addPost(this.form.value.title, this.form.value.content)
      this.form.reset()
    }
  }
}
