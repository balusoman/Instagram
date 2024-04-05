import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [RouterLink,MatPaginatorModule,CommonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {

  posts:Post[]=[]
  private postsSub!:Subscription
  private authListenerSubs:any
  userIsAuthenticated = false;
  totalPosts=10
  postsPerPage=10
  currentPage=1
  userId!:string

constructor(public postService:PostsService, private authService:AuthService){

}

ngOnInit() { 
  this.postService.getPost(this.postsPerPage,this.currentPage)
 this.postsSub = this.postService.getPostUpdateListener().subscribe((postData:{posts:Post[],postCount:number})=>{
    this.posts=postData.posts
    this.totalPosts=postData.postCount
  })
  this.userIsAuthenticated = this.authService.getIsAuth();
  this.userId = this.authService.getUserId();
  
  this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
    this.userIsAuthenticated = isAuthenticated;
    this.userId = this.authService.getUserId();
  })
}

onEdit(id:string){
  console.log(id,"edited")
}

onDelete(id:string){
  console.log(id,"deleted")
  this.postService.deletePost(id,this.userId).subscribe(()=>{
    this.postService.getPost(this.postsPerPage,this.currentPage)
  })
}

onChangedPage(pageData:PageEvent){
  this.currentPage=pageData.pageIndex+1
  this.postsPerPage=pageData.pageSize
  this.postService.getPost(this.postsPerPage,this.currentPage)

}

ngOnDestroy(){
  this.postsSub.unsubscribe()
}
}
