import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Post } from '../../models/post.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [MatButtonModule,ReactiveFormsModule,FormsModule,MatInputModule,CommonModule,MatProgressSpinnerModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy{

  form!:FormGroup 
  mode = 'create';
  postId!: string;
  post!:Post
  isLoading = false;
  imgPreview!:string
  private authStatusSub!: Subscription;

  userId!:string

  constructor(public postService:PostsService , public route:ActivatedRoute,public router:Router,private authService:AuthService){}



  
  ngOnInit() {

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    this.userId = this.authService.getUserId();

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('id')){
        console.log("Edit mode")
        this.mode = 'edit';
        this.postId = paramMap.get('id')!;
        this.isLoading = true;
        this.postService.getPostById(this.postId).subscribe((postData)=>{
          this.isLoading = false;
          this.post = {id:postData._id,title:postData.title,content:postData.content,imagePath:postData.imagePath,creator:postData.creator}
          this.form.setValue({
            title:this.post.title,
            content:this.post.content,
            image:this.post.imagePath,
            creator:this.post.creator

          })
            
        })
      }else{
        console.log("Create mode")
        this.mode = 'create';
        this.postId = null!;
      }
    })

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] }),
      creator: new FormControl(this.userId, { validators: [Validators.required] })
    });
  }

  onSavePost(){
    if(this.form.invalid){
      return
    }
    this.isLoading = true;
     if(this.mode==='create'){
      this.postService.addPost(this.form.value.title, this.form.value.content,this.form.value.image,this.userId)
    }else{
      this.postService.updatePost(this.postId,this.form.value.title, this.form.value.content,this.form.value.image,this.userId)
    }
    this.form.reset() 
    this.router.navigate([''])
  }

  onImagePicked(event:Event){
    const file= (event.target as HTMLInputElement ).files![0]
    this.form.patchValue({image:file})
    this.form.get('image')?.updateValueAndValidity()
    console.log(this.form)
    const reader = new FileReader()
    reader.onload = ()=>{
      this.imgPreview = reader.result as string
    } 
    reader.readAsDataURL(file)
  }

  
ngOnDestroy(): void { 
    this.authStatusSub.unsubscribe();
  }
}
