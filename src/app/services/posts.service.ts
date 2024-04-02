import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import e, { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:Post[]=[]
  private postUpdated=new Subject<{posts:Post[],postCount:number}>()

  constructor(private http:HttpClient) { }

  getPost(postsPerPage:number,currentPage:number){
    const queryParams=`?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{message:string,posts:any,maxPosts:number}>('http://localhost:3000/api/posts'+ queryParams)
    .pipe(map((postData)=>{
      return { posts: postData.posts.map((post: { title: any; content: any; _id: any;imagePath:any }) =>{
        return {
          title:post.title,
          content:post.content,
          id:post._id,
          imagePath:post.imagePath
        }
      }),maxPosts:postData.maxPosts
    }
  }))
    .subscribe((transformedPostData)=>{
      this.posts=transformedPostData.posts
      this.postUpdated.next({
        posts:[...this.posts],
        postCount: transformedPostData.maxPosts
      })
    })
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable()
  }

  getPostById(id:any){ 
    return this.http.get<{_id:any,title:string,content:string,imagePath:string }>('http://localhost:3000/api/posts/'+id)
  }

  addPost(title:string,content:string,image:File){
    // const post:Post={
    //   id:null,
    //   title:title,
    //   content:content
    // }
    const postData=new FormData()
    postData.append('title',title)
    postData.append('content',content)
    postData.append('image',image,title)

    this.http.post<{message:string,post:any}>('http://localhost:3000/api/posts',postData)
    .subscribe((responseData)=>{
      
    })
  }

  updatePost(id:string,title:string,content:string,image:File | string){
    // const post:Post={
    //   id:id,
    //   title:title,
    //   content:content,
    //   imagePath:null
    // }
    let postData :  Post | FormData
    if(typeof(image)==='object'){
      postData=new FormData()
      postData.append('id',id)
      postData.append('title',title)
      postData.append('content',content)
      postData.append('image',image,title)
    }else{
      postData={
        id:id,
        title:title,
        content:content,
        imagePath:image
      }
    }
    this.http.put('http://localhost:3000/api/posts/'+id,postData)
    .subscribe((response:any)=>{
      
    })
  }

  deletePost(postId:string){ 
   return this.http.delete('http://localhost:3000/api/posts/'+postId)
  }
}
