import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:Post[]=[]
  private postUpdated=new Subject<{posts:Post[],postCount:number}>()

  constructor(private http:HttpClient) { }

  getPost(postsPerPage:number,currentPage:number){
    const queryParams=`?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{message:string,posts:any,maxPosts:number}>(BACKEND_URL+ queryParams)
    .pipe(map((postData)=>{
      return { posts: postData.posts.map((post: { title: any; content: any; _id: any;imagePath:any,creator:string }) =>{
        return {
          title:post.title,
          content:post.content,
          id:post._id,
          imagePath:post.imagePath,
          creator:post.creator
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
    return this.http.get<{_id:any,title:string,content:string,imagePath:string,creator:string}>(BACKEND_URL+id)
  }

  addPost(title:string,content:string,image:File,creator:string){
    // const post:Post={
    //   id:null,
    //   title:title,
    //   content:content
    // }
    const postData=new FormData()
    postData.append('title',title)
    postData.append('content',content)
    postData.append('image',image,title)
    postData.append('creator',creator)

    this.http.post<{message:string,post:any}>(BACKEND_URL,postData)
    .subscribe((responseData)=>{
      console.log(responseData)
      // const newPost = responseData.post
      // this.posts.push(newPost)
      // this.postUpdated.next({
      //   posts:[...this.posts], postCount:this.posts.length+1
      // })
    })
  }

  updatePost(id:string,title:string,content:string,image:File | string,creator:string){
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
      postData.append('creator',creator)
    }else{
      postData={
        id:id,
        title:title,
        content:content,
        imagePath:image,
        creator:creator
      }
    }
    console.log(postData,id)
    this.http.put(BACKEND_URL+id,postData)
    .subscribe((response:any)=>{
      console.log(response)
    })
  }

  deletePost(postId: string, creator: string) {
    console.log(postId);
    return this.http.delete(BACKEND_URL + postId, { body: { creator } });
  }
}
