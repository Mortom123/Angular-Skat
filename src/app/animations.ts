import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

export const slide = trigger('slide',[
    transition(':enter',[
        style({ transform: 'translateX(-100%)' }),
        animate(300)
    ]),
    transition(':leave',[
        style({ transform: 'translateX(100%)' }),
        animate(300)
    ])
])