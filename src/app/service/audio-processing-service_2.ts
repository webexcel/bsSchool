// audio-processing.service.ts
import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';

@Injectable({
  providedIn: 'root',
})
export class AudioProcessingService {
  private fileName = 'recording.mp3';

  constructor() {}

  async startRecording(): Promise<void> {
    const permission = await VoiceRecorder.requestAudioRecordingPermission();

    // const permission: RecordingPermissionResponse = await VoiceRecorder.requestAudioRecordingPermission();

    if (!permission.value) {
      throw new Error('Microphone permission not granted');
    }

    await VoiceRecorder.startRecording();
    console.log('Recording started');
  }

  async stopRecording(): Promise<string> {
    const recording: RecordingData = await VoiceRecorder.stopRecording();

    if (!recording.value) {
      throw new Error('No recording found');
    }

    const base64Audio = recording.value;

    // const base64Audio = `data:audio/wav;base64,${recording.value}`;
    const base64Only = recording.value.recordDataBase64;
    const mimeType = recording.value.mimeType || 'audio/wav';

    // ✅ Prefix it with the correct data URL header
    const base64AudioReturn = `data:${mimeType};base64,${base64Only}`;

    console.log('Recording stopped. Base64 length:', base64Audio);

    // Optionally save it

    await Filesystem.writeFile({
      path: this.fileName,
      data: base64Audio.recordDataBase64,
      directory: Directory.Data,
    });

    console.log('File saved to app storage');

    // return base64Audio;
    return `data:audio/wav;base64,${base64Audio.recordDataBase64}`;
  }
}
