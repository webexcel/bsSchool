import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AudioProcessingService {
    private mediaRecorder: any; private audioChunks: any[] = [];

    constructor() { }

    async startRecording() {
        this.audioChunks = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event: any) => {
            this.audioChunks.push(event.data);
        };

        this.mediaRecorder.start();
    }

    stopRecording(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.mediaRecorder) {
                this.mediaRecorder.onstop = async () => {
                    this.mediaRecorder.stream.getTracks().forEach((track: any) => track.stop());

                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    const reader = new FileReader();

                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        const base64String = reader.result as string;
                        resolve(base64String);
                    };
                };
            }

            if (this.mediaRecorder) {
                this.mediaRecorder.stop();
            } else {
                reject('MediaRecorder is not initialized.');
            }
            this.audioChunks = [];
        });
    }
}