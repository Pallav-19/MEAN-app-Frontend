import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material/paginator";
@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription;
  isLoading = false;
  totalPosts = 10;
  postPerPage = 2;
  currentPage: number = 1;
  pageSizeOptions = [1, 2, 5, 10]
  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((gotposts: Post[]) => {
        this.isLoading = false;
        this.posts = gotposts;
      });
  }
  onDelete(postId: String) {
    this.postsService.deletePost(postId);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });

  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
  onChangedPage(event: PageEvent) {
    this.currentPage = event.pageIndex+1;
    this.postPerPage = event.pageSize
    // console.log(event);
    this.postsService.getPosts(this.postPerPage, this.currentPage);


  }
}
