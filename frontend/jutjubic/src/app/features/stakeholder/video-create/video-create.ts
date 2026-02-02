import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { VideoDetailCreateComponent } from '../../stakeholder/video-detail-create/video-detail-create';

@Component({
  selector: 'app-video-create',
  imports: [MatIconModule, MatDividerModule],
  templateUrl: './video-create.html',
  styleUrl: './video-create.css',
})
export class VideoCreateComponent {
  selectedFile: File | null = null;
  @Input() requiredFileType: string = 'video / mp4';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  dialog = inject(MatDialog);

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private dialogRef: MatDialogRef<VideoCreateComponent>,
  ) {}

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
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
}
