import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [RouterLink],
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


onEdit(id:string){
  console.log(id,"edited")
}

onDelete(id:string){
  console.log(id,"deleted")
  this.postService.deletePost(id)
}





ngOnDestroy(){
  this.postsSub.unsubscribe()
}
}
