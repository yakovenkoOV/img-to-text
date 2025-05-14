import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NinjaResponse {
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class NinjaService {
  private readonly API_URL = 'https://api.api-ninjas.com/v1/imagetotext';
  private readonly API_KEY = 'y+xLbrLSrquziZqSU0gmgQ==SFueupbIQeygvdDx';

  constructor(private http: HttpClient) {}

  extractText(imageFile: File): Observable<NinjaResponse[]> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const headers = new HttpHeaders().set('X-Api-Key', this.API_KEY);

    return this.http.post<NinjaResponse[]>(this.API_URL, formData, { headers });
  }
}
