// src/app/services/ytservice.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class YtProvider {
  apiKey = 'AIzaSyB8Sjj33QKnawn355iZG9hLCwNaIkeg2sg';
  channelId = 'UC3g7F9wNBbsNflXJEzpmwng'

  constructor(public http: HttpClient) {}

  getPlaylistsForChannel() {
    return this.http
      .get(
        `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=50&type=video`
      )
      .pipe(map((res: any) => res.items));
  }

  getVideoDetails(videoId: string) {
    return this.http
      .get(
        `https://www.googleapis.com/youtube/v3/videos?key=${this.apiKey}&id=${videoId}&part=snippet,contentDetails,statistics`
      )
      .pipe(map((res: any) => res.items[0]));
  }
}
