import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [MatButtonModule,ReactiveFormsModule,FormsModule,MatInputModule,CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {

  form!:FormGroup 
  mode = 'create';
  postId!: string;
  post!:Post
  imgPreview!:string

  constructor(public postService:PostsService , public route:ActivatedRoute,public router:Router){}



  
  ngOnInit() {

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('id')){
        console.log("Edit mode")
        this.mode = 'edit';
        this.postId = paramMap.get('id')!;
        this.postService.getPostById(this.postId).subscribe((postData)=>{
          this.post = {id:postData._id,title:postData.title,content:postData.content,imagePath:postData.imagePath}
          this.form.setValue({
            title:this.post.title,
            content:this.post.content,
            image:this.post.imagePath
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
      image: new FormControl(null, { validators: [Validators.required] })
    });
  }

  onSavePost(){
    if(this.form.invalid){
      return
    }
     if(this.mode==='create'){
      this.postService.addPost(this.form.value.title, this.form.value.content,this.form.value.image)
    }else{
      this.postService.updatePost(this.postId,this.form.value.title, this.form.value.content,this.form.value.image)
    }
    this.form.reset() 
    this.router.navigate(['/feed'])
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
}
