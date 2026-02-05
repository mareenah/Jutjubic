import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCreateComponent } from './video-create';

describe('VideoCreate', () => {
  let component: VideoCreateComponent;
  let fixture: ComponentFixture<VideoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
