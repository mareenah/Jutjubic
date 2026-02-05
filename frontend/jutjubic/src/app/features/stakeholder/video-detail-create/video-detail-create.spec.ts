import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDetailCreateComponent } from './video-detail-create';

describe('VideoDetailCreate', () => {
  let component: VideoDetailCreateComponent;
  let fixture: ComponentFixture<VideoDetailCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoDetailCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoDetailCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
