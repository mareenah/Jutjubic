import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchPartyCreateComponent } from './watch-party-create';

describe('WatchPartyCreateComponent', () => {
  let component: WatchPartyCreateComponent;
  let fixture: ComponentFixture<WatchPartyCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchPartyCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchPartyCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
