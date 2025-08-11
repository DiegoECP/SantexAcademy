import { Routes } from '@angular/router';
import { PlayersListComponent } from './components/players-list/players-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'players', pathMatch: 'full' },
  { path: 'players', component: PlayersListComponent },
];
