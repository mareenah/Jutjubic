import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { StakeholderService } from '../stakeholder.service';

@Component({
  selector: 'app-video-detail-create',
  imports: [],
  templateUrl: './video-detail-create.html',
  styleUrl: './video-detail-create.css',
})
export class VideoDetailCreateComponent implements OnInit {
  videoPreviewUrl?: string;
  videoPreview?: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { videoFile: File },
    private stakeholderService: StakeholderService,
  ) {}

  ngOnInit(): void {
    this.videoPreview = this.data.videoFile;
    console.log(this.data.videoFile);
    console.log(this.videoPreview);
    setTimeout(() => {
      this.videoPreviewUrl = URL.createObjectURL(this.videoPreview);
      console.log(this.videoPreviewUrl);
    }, 500);
  }
}
