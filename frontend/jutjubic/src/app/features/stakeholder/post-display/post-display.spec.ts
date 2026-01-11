import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDisplay } from './post-display';

describe('PostDisplay', () => {
  let component: PostDisplay;
  let fixture: ComponentFixture<PostDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
