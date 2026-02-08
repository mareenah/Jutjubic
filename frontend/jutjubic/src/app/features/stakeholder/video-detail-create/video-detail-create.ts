import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { StakeholderService } from '../stakeholder.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-video-detail-create',
  imports: [
    MatDividerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatChipsModule,
  ],
  templateUrl: './video-detail-create.html',
  styleUrl: './video-detail-create.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDetailCreateComponent implements OnInit, AfterViewInit {
  headerTitle: string = '';
  videoForm: FormGroup<any>;
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  videoPreviewUrl?: string;
  videoPreview?: any;
  thumbnailFile: File | null = null;
  thumbnailPreviewUrl: string | null = null;
  tags: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  removable = true;

  titleRegex: RegExp = /^[\p{L}\p{N} .,'"!?:()-]{2,50}$/u;
  descriptionRegex = /^[\p{L}\p{N}\s.,'"!?:;()\-\u2013\u2014_/+#@%\n\r]{5,2000}$/u;
  tagsRegex: RegExp = /^[\p{L}\p{N}_-]{1,30}$/u;
  countryRegex: RegExp = /^$|^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ\s'-]+$/;
  cityRegex: RegExp = /^$|^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ\s'-]+$/;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { videoFile: File },
    private stakeholderService: StakeholderService,
    private dialogRef: MatDialogRef<VideoDetailCreateComponent>,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.videoPreviewUrl = URL.createObjectURL(data.videoFile);
    this.videoForm = this.fb.group({
      title: this.fb.control('', [Validators.required, Validators.pattern(this.titleRegex)]),
      description: this.fb.control('', [
        Validators.required,
        Validators.pattern(this.descriptionRegex),
      ]),
      tags: this.fb.control<string[]>([], [Validators.required, Validators.min(1)]),
      tagInput: this.fb.control('', [Validators.pattern(this.tagsRegex)]),
      thumbnail: this.fb.control<File | null>(null, Validators.required),
      country: this.fb.control('', [
        Validators.pattern(this.countryRegex),
        Validators.maxLength(30),
      ]),
      city: this.fb.control('', [Validators.pattern(this.cityRegex), Validators.maxLength(30)]),
    });
  }

  ngOnInit(): void {
    this.videoPreview = this.data.videoFile;
    setTimeout(() => {
      this.videoPreviewUrl = URL.createObjectURL(this.videoPreview);
    }, 500);

    this.headerTitle = this.videoPreview.name.replace('.mp4', '');
  }

  ngAfterViewInit(): void {
    if (this.videoEl) {
      this.videoEl.nativeElement.muted = true;
      this.videoEl.nativeElement.volume = 0;
      this.videoEl.nativeElement.play();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onThumbnailTouched(): void {
    const control = this.videoForm.get('thumbnail');
    control?.markAsTouched();
    control?.updateValueAndValidity();
  }

  onTagsTouched(): void {
    const control = this.videoForm.get('tags');
    control?.markAsTouched();
    control?.updateValueAndValidity();
  }

  onThumbnailSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const control = this.videoForm.get('thumbnail');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      control?.setErrors({ invalidType: true });
      control?.markAsTouched();
      return;
    }

    control?.setValue(file);
    control?.markAsTouched();

    this.thumbnailFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.thumbnailPreviewUrl = reader.result as string;
      this.cdr.markForCheck();
    };

    reader.readAsDataURL(file);

    this.thumbnailPreviewUrl = URL.createObjectURL(file);
    this.videoForm.patchValue({ thumbnail: file });
    this.videoForm.get('thumbnail')?.updateValueAndValidity();
  }

  addTag(event: any) {
    const tagCtrl = this.videoForm.get('tagInput')!;
    const value = tagCtrl.value?.trim();

    if (!value) return;

    if (tagCtrl.invalid) {
      tagCtrl.markAsTouched();
      event.chipInput!.clear();
      return;
    }

    const exists = this.tags.some((tag) => tag.toLowerCase() === value.toLowerCase());
    if (exists) {
      tagCtrl.reset();
      event.chipInput?.clear();
      return;
    }
    this.tags.push(value);
    this.videoForm.get('tags')!.setValue(this.tags);
    this.videoForm.get('tags')!.markAsTouched();

    tagCtrl.reset();
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
    this.videoForm.get('tags')?.setValue(this.tags);
    this.videoForm.get('tags')?.markAsTouched();
  }

  trackBy(index: number, tag: any) {
    return index;
  }

  upload(): void {
    if (this.videoForm.valid) {
      const formData = new FormData();

      formData.append('title', this.videoForm.value.title!);
      formData.append('description', this.videoForm.value.description!);
      formData.append('country', this.videoForm.value.country || '');
      formData.append('city', this.videoForm.value.city || '');
      (this.videoForm.value.tags ?? []).forEach((tag: string) => {
        formData.append('tags', tag);
      });
      formData.append('thumbnail', this.videoForm.value.thumbnail as File);
      formData.append('video', this.videoPreview as File);

      this.stakeholderService.uploadVideo(formData).subscribe({
        next: () => {
          alert('Uspješan upload videa!');
          this.dialogRef.close();
          this.router.navigate(['/']);
        },
        error: (error) => {
          switch (error.status) {
            case 400:
            case 401:
            case 404:
            case 409:
            case 500:
              alert(error.error.message);
              break;
            default:
              alert(error.error?.message || 'Nepoznata greška.');
              break;
          }
        },
      });
    } else {
      this.videoForm.markAllAsTouched();
      console.warn('Form is invalid', this.videoForm.errors);
      alert('Popuni formu validno!');
    }
  }
}
