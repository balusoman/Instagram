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
  private postUpdated=new Subject<Post[]>()

  constructor(private http:HttpClient) { }

  getPost(){
    this.http.get<{message:string,posts:any}>('http://localhost:3000/api/posts')
    .pipe(map((postData)=>{
      return postData.posts.map((post: { title: any; content: any; _id: any;imagePath:any }) =>{
        return {
          title:post.title,
          content:post.content,
          id:post._id,
          imagePath:post.imagePath
        }})
    }))
    .subscribe((transformedData)=>{
      this.posts=transformedData
      this.postUpdated.next([...this.posts])
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
      const post:Post={id:responseData.post.id,title:title,content:content,imagePath:responseData.post.imagePath}
      const postId=responseData.post.id
      post.id=postId
      this.posts.push(post)
      this.postUpdated.next([...this.posts])
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
      const updatedPosts=[...this.posts]
      const oldPostIndex=updatedPosts.findIndex(p=>p.id === id)
      const post:Post={
        id:id,
        title:title,
        content:content,
        imagePath:response.post.imagePath
      }
      console.log(response)
      console.log(post)
      updatedPosts[oldPostIndex]=post
      this.posts=updatedPosts
      this.postUpdated.next([...this.posts])
    })
  }

  deletePost(postId:string){ 
    this.http.delete('http://localhost:3000/api/posts/'+postId)
    .subscribe(()=>{
      console.log('deleted') 
      const updatedPosts=this.posts.filter(post=>post.id!==postId)
      this.posts = updatedPosts
      this.postUpdated.next([...this.posts])
    })
  }
}
