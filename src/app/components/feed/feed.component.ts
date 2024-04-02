import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';



@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [RouterLink,MatPaginatorModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {

  posts:Post[]=[]
  private postsSub!:Subscription
  totalPosts=10
  postsPerPage=2
  currentPage=1

constructor(private postService:PostsService){}

ngOnInit() { 
this.postService.getPost(this.postsPerPage,this.currentPage)
 this.postsSub = this.postService.getPostUpdateListener().subscribe((postData:{posts:Post[],postCount:number})=>{
    this.posts=postData.posts
    this.totalPosts=postData.postCount
    this.posts=postData.posts
  })
}


onEdit(id:string){
  console.log(id,"edited")
}

onDelete(id:string){
  console.log(id,"deleted")
  this.postService.deletePost(id).subscribe(()=>{
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
