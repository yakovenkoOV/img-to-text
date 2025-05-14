import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { NinjaResponse, NinjaService } from '../services/imagetotext.api';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css',
})
export class ConverterComponent {
  errorMessage: string = '';
  imagePreview: string | null = null;
  extractedText: string = '';
  isLoading: boolean = false;

  constructor(
    private ninjaService: NinjaService,
    private clipboard: Clipboard
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // file size
    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = 'File size must be less than 2MB';
      return;
    }

    console.log(['image/jpeg', 'image/png'].includes(file.type));
    // file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.errorMessage = 'Only JPEG and PNG files are allowed';
      return;
    }

    this.errorMessage = '';

    // image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    // api call
    this.isLoading = true;
    this.ninjaService.extractText(file).subscribe({
      next: (response: NinjaResponse[]) => {
        this.extractedText = response.map((item) => item.text).join('\n');
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error processing image. Please try again.';
        this.isLoading = false;
      },
    });
  }

  copyToClipboard(): void {
    if (this.extractedText) {
      this.clipboard.copy(this.extractedText);
    }
  }
}
