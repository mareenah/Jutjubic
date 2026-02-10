import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchPartyDisplayComponent } from './watch-party-display';

describe('WatchPartyDisplayComponent', () => {
  let component: WatchPartyDisplayComponent;
  let fixture: ComponentFixture<WatchPartyDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchPartyDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchPartyDisplayComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
