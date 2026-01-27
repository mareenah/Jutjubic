import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-video-create',
  imports: [MatIconModule, MatDividerModule],
  templateUrl: './video-create.html',
  styleUrl: './video-create.css',
})
export class VideoCreateComponent {}
