import { Routes } from '@angular/router';
import { FeedComponent } from './components/feed/feed.component';
import { ExploreComponent } from './components/explore/explore.component';
import { CreateComponent } from './components/create/create.component';

export const routes: Routes = [
    { path: '', redirectTo: 'feed', pathMatch: 'full' },
    {
        path:'feed',
        component:FeedComponent
    },
    {
        path:'explore',
        component:ExploreComponent
    },
    {
        path:'create',
        component:CreateComponent
    }
    // {
    //     path: '**', 
    //     component:PagenotfoundComponent
    //   }
];
