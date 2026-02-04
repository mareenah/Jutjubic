import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VideoDetailCreateComponent } from '../../stakeholder/video-detail-create/video-detail-create';

@Component({
  selector: 'app-video-create',
  imports: [MatIconModule, MatDividerModule],
  templateUrl: './video-create.html',
  styleUrl: './video-create.css',
})
export class VideoCreateComponent {
  selectedFile: File | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  dialog = inject(MatDialog);
  MAX_VIDEO_SIZE = 200 * 1024 * 1024;

  constructor(private dialogRef: MatDialogRef<VideoCreateComponent>) {}

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      if (file.type !== 'video/mp4') {
        alert('Dozvoljen je samo MP4 video.');
        return;
      }

      if (file.size > this.MAX_VIDEO_SIZE) {
        alert('Video mora biti manji od 200MB.');
        return;
      }

      this.selectedFile = file;
      this.dialogRef.close();

      this.dialog.open(VideoDetailCreateComponent, {
        height: '87vh',
        width: '65vw',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: { videoFile: file },
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
