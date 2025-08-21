import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';

@Injectable({
  providedIn: 'root',
})
export class AudioProcessingService {
  private mediaRecorder: any;
  private audioChunks: any[] = [];
  private audioFile: MediaObject | null = null;
  private fileName = 'recording.mp3';

  constructor(private media: Media, private file: File) {}


  startRecording() {
    this.audioFile = this.media.create(
      this.file.externalDataDirectory + this.fileName
    );
    this.audioFile.startRecord();
    console.log('Recording started');
  }

  stopRecording(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.audioFile) {
        reject('No active recording');
        return;
      }

      this.audioFile.stopRecord();
      console.log('Recording stopped');

      const path = this.file.externalDataDirectory || this.file.dataDirectory;
      console.log('Reading from path:', path, 'Filename:', this.fileName);
      // Wait a moment to ensure file write is finished
      setTimeout(() => {
        this.file
          .readAsDataURL(path, this.fileName)
          .then((base64) => {
            resolve(base64);
          })
          .catch((err) => {
            reject('Failed to read file: ' + JSON.stringify(err));
          });
      }, 1500);
    });
  }
}
