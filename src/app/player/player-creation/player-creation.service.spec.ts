import { TestBed } from '@angular/core/testing';

import { PlayerCreationService } from './player-creation.service';

describe('PlayerCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerCreationService = TestBed.get(PlayerCreationService);
    expect(service).toBeTruthy();
  });
});
