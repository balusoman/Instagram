import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';

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
      return postData.posts.map((post: { title: any; content: any; _id: any; }) =>{
        return {
          title:post.title,
          content:post.content,
          id:post._id
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
    return this.http.get<{_id:any,title:string,content:string}>('http://localhost:3000/api/posts/'+id)
  }

  addPost(title:string,content:string){
    const post:Post={
      id:null,
      title:title,
      content:content
    }
    this.http.post<{message:string,postId:string}>('http://localhost:3000/api/posts',post)
    .subscribe((responseData)=>{
      const postId=responseData.postId
      post.id=postId
      this.posts.push(post)
      this.postUpdated.next([...this.posts])
    })
  }

  updatePost(id:string,title:string,content:string){
    const post:Post={
      id:id,
      title:title,
      content:content
    }
    this.http.put('http://localhost:3000/api/posts/'+id,post)
    .subscribe(response=>{
      const updatedPosts=[...this.posts]
      const oldPostIndex=updatedPosts.findIndex(p=>p.id===post.id)
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
