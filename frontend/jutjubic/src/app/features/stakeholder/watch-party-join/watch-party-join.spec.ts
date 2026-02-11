import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchPartyJoinComponent } from './watch-party-join';

describe('WatchPartyJoin', () => {
  let component: WatchPartyJoinComponent;
  let fixture: ComponentFixture<WatchPartyJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchPartyJoinComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchPartyJoinComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
