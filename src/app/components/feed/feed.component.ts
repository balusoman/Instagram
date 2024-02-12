import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';


@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {

  posts:Post[]=[
    {
    title:'first Title',
    content:'1st content'
  },
  {
    title:'second Title',
    content:'2nd content'
  },
  {
    title:'third Title',
    content:'3rd content'
  },
]

constructor(private postService:PostsService){}

ngOnInit() {
  this.posts = this.postService.getPost()
}
}
