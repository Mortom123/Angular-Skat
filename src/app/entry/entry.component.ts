import { Component, OnInit, AfterViewInit } from '@angular/core';
import { default_config } from './particles';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit, AfterViewInit {

  params = default_config

  style = {
    'position': 'fixed',
    'width': '100%',
    'height': '100%',
    'z-index': -1,
    'top': 0,
    'left': 0,
    'right': 0,
    'bottom': 0,
  };
  
  constructor() {
  }

  ngOnInit() { }

  ngAfterViewInit() {

  }

}
