import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {

  posts:Post[]=[]
  private postsSub!:Subscription

constructor(private postService:PostsService){}

ngOnInit() { 
this.postService.getPost()
 this.postsSub = this.postService.getPostUpdateListener().subscribe((posts:Post[])=>{
    this.posts=posts
  })
}

ngOnDestroy(){
  this.postsSub.unsubscribe()
}
}
