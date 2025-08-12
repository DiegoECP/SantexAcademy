import { Routes } from '@angular/router';
import { PlayersListComponent } from './components/player-list/players-list.component';
import { PlayerDetailComponent } from './components/player-detail/player-detail.component';


export const routes: Routes = [
  { path: '', redirectTo: 'players', pathMatch: 'full' },
  { path: 'players', component: PlayersListComponent },
  { path: 'players/:id', component: PlayerDetailComponent },
];
