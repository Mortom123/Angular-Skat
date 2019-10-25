import { Component, OnInit } from '@angular/core';
import { PlayerDataBase } from '../player-database';
import { Player } from '../player';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-player-overview',
  templateUrl: './player-overview.component.html',
  styleUrls: ['./player-overview.component.css']
})
export class PlayerOverviewComponent implements OnInit {

  displayedColumn = ["id", "name"]
  //dataSource = new Subject<Player[]>()
  dataSource = [
    {id: '123', name:'4656'},
    {id: '123', name:'4656'},
    {id: '123', name:'4656'},
    {id: '123', name:'4656'}  
  ]
  constructor(private db: PlayerDataBase) { }

  ngOnInit() {
    this.dataSource.next([
      {id: '123', name:'4656'},
      {id: '123', name:'4656'},
      {id: '123', name:'4656'},
      {id: '123', name:'4656'}  
    ])
    // this.db.players.toArray((players) => {
    //   console.log(players)
    //   this.dataSource.next(players)
    // })
  }

}
