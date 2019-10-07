import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface RouteEntries {
  name: string,
  icon?: string,
  route: string,
}

interface ContainerEntries {
  name: string,
  icon?: string,
  base: string,
  subEntries: RouteEntries[]
}

export type MenuEntries = RouteEntries | ContainerEntries

export const menuEntries: MenuEntries[] = [
  { name: "Start", icon:"home", route:''},
  {
    name: "Spieler", icon: "group",
    base: "player",
    subEntries: [
      { name: "Spieler ansehen", icon: 'view_list', route:'add'},
      { name: "Spieler erstellen", icon:"add" , route:''}
    ]
  },
  {
    name: "Skat", icon: "games",
    base: "skat",
    subEntries: [
      { name: "Spiele ansehen" , icon: 'view_list', route:'skat'},
      { name: "Spiel erstellen", icon:"add" , route:'skat'}
    ]
  }
]

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.scss']
})
export class HeaderbarComponent implements OnInit {

  entries: any[] = menuEntries

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navTo(route: string){
    this.router.navigateByUrl(route)
  }


}
