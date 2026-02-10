import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchPartiesDisplayComponent } from './watch-parties-display';

describe('WatchPartiesDisplayComponent', () => {
  let component: WatchPartiesDisplayComponent;
  let fixture: ComponentFixture<WatchPartiesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchPartiesDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchPartiesDisplayComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
