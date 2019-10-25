import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { slide } from 'src/app/animations';
import { PlayerCreationService } from './player-creation.service';

@Component({
  selector: 'app-player-creation',
  templateUrl: './player-creation.component.html',
  styleUrls: ['./player-creation.component.css'],
  animations: [slide]
})
export class PlayerCreationComponent implements OnInit {

  public playerForm = new FormGroup({
    name: new FormControl('', {validators: [Validators.required]})
  })

  constructor(private playerCreation: PlayerCreationService) { }

  ngOnInit() {
  }

  onSubmit() {
    Object.keys(this.playerForm.controls).forEach(key => this.playerForm.get(key).markAsTouched())

    if(this.playerForm.invalid) {
      return
    }

    this.playerCreation.createPlayer(this.playerForm.get('name').value)

  }

}
