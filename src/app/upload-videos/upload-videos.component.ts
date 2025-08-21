import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, IonModal } from '@ionic/angular';
import {
  Base64String,
  GenericResponse,
  RecordingData,
  VoiceRecorder,
} from 'capacitor-voice-recorder';
import { environment } from 'src/environments/environment';
import { AudioProcessingService } from '../service/audio-processing-service';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { VideoProcessingService } from '../service/video-processing-service';

@Component({
  selector: 'app-upload-videos',
  templateUrl: './upload-videos.component.html',
  styleUrls: ['./upload-videos.component.scss'],
})
export class UploadVideosComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  ios: any = false;
  contact: any;
  showDatePicker: boolean = false;
  StuDetails: any = [];
  selectedStudent: any;
  parentMessage: any = {};
  audioData: {
    fileName: string;
    base64: Base64String | null;
    duration: number;
  } = {
    fileName: '',
    base64: null,
    duration: 0,
  };
  fileName: string | undefined;
  timer!: NodeJS.Timeout;
  recordingTimer = 0;
  error: any = false;
  recording: boolean = false;
  adNum: any;
  uploadedData: any;
  adno: any;
  sname: any = '';
  runningTime: number = 0;
  timerInterval: any;
  startTime: any;
  selectedSegment: any;
  segmentItems: any[] = [];

  constructor(
    public authservice: AuthService,
    public storage: StorageService,
    public alertCtrl: AlertController,
    private videoService: VideoProcessingService,
    private fileOpener: FileOpener,
    private file: File,
    public loading: LoadingService,
    private cdr: ChangeDetectorRef,
    private audioService: AudioProcessingService
  ) {}

  ngOnInit() {
    this.parentMessage['image'] = '';
    this.parentMessage['thumbnail'] = '';
    this.parentMessage['message'] = '';
    this.parentMessage['filename'] = '';
    this.getStudentDetail();
    // this.segmentItems = this.storage.getjson('studentDetail');
    // this.StuDetails = this.segmentItems[0];
    // this.selected(this.StuDetails);
  }

  selected(event: any) {
    this.StuDetails = event;
    this.selectedSegment = event;
    this.getParentUploadDetails(this.StuDetails.ADNO, this.StuDetails.CLASS_ID);
  }

  onSegmentChanged(event: Event, data: any) {
    this.selected(data);
  }

  getStudentDetail() {
    this.loading.present();
    let app_versionCode = environment.app_versionCode;
    this.authservice
      .post('getMobStudentDetailothers', {
        id: this.storage.get('mobileid'),
        ver: app_versionCode,
      })
      .subscribe(
        (result: any) => {
          this.loading.dismissAll();
          if (result['status']) {
            this.segmentItems = result['data'];
            this.StuDetails = this.segmentItems[0];
            this.selected(this.StuDetails);
          } else {
            this.segmentItems = this.storage.getjson('studentDetail');
            this.StuDetails = this.segmentItems[0];
            this.selected(this.StuDetails);
          }
        },
        (err: any) => {
          this.loading.dismissAll();
        }
      );
  }

  onSubmit(form: NgForm) {
    this.loading.present();
    this.parentMessage['name'] = this.StuDetails.NAME;
    this.parentMessage['classid'] = this.StuDetails.CLASS_ID;
    this.parentMessage['AdmNo'] = this.StuDetails.ADNO;

    this.authservice.post('saveMessage', this.parentMessage).subscribe(
      (res: any) => {
        this.loading.dismissAll();
        if (res['status']) {
          form.resetForm();
        }
        this.parentMessage.image = '';
        this.parentMessage.thumbnail = '';
        this.parentMessage.message = '';
        this.parentMessage.filename = '';
        this.getParentUploadDetails(
          this.StuDetails.ADNO,
          this.StuDetails.CLASS_ID
        );
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }

  async getParentUploadDetails(ADNO: any, CLASS_ID: any) {
    this.adno = ADNO;
    const data = { adno: this.adno, classid: CLASS_ID };
    this.authservice.post('getParentUploadDetails', data).subscribe(
      (res: any) => {
        if (res['status']) {
          this.uploadedData = res['data'][0];

          this.cdr.detectChanges();
        } else {
          this.uploadedData = [];
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  cancel_date() {
    this.modal.dismiss(null, 'confirm');
  }

  confirm_date() {
    this.modal.dismiss(null, 'confirm');
  }
  showHideDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  checkRecordingAbility() {
    VoiceRecorder.requestAudioRecordingPermission().then(
      (result: GenericResponse) => {}
    );
    VoiceRecorder.canDeviceVoiceRecord()
      .then((result: GenericResponse) => true)
      .catch(() => false);
  }

  async delete(ID: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Message',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            this.authservice.post('deleteMessage', { id: ID }).subscribe(
              async (res: any) => {
                if (res['status']) {
                  this.uploadedData = this.uploadedData.filter(
                    (item: any) => item.id !== ID
                  );
                  this.cdr.detectChanges();
                  await this.getParentUploadDetails(
                    this.StuDetails.ADNO,
                    this.StuDetails.CLASS_ID
                  );
                }
              },
              (err) => {
                console.error(err);
              }
            );
          },
        },
      ],
    });
    await alert.present();
  }

  open() {
    this.alertCtrl
      .create({
        header: 'SchoolTree Teachers',
        mode: 'ios',
        cssClass: 'popup-login',
        buttons: [
          {
            text: 'Open Files',
            handler: () => {
              this.videoService
                .promptForVideo()
                .then((videoFile) => {
                  if (videoFile.type.startsWith('video/')) {
                    if (videoFile.size > 5 * 1024 * 1024) {
                      alert(`File size exceeds 5 MB limit.`);
                      return;
                    }
                    this.videoService.uploadVideo(
                      this.parentMessage,
                      videoFile
                    );
                    this.videoService
                      .generateThumbnail(videoFile)
                      .then((thumbnailData) => {
                        this.parentMessage['thumbnail'] = thumbnailData;
                      })
                      .catch((error) => {
                        console.error('Error generating thumbnail:', error);
                      });
                  }
                  const reader = new FileReader();
                  reader.onload = async (e: any) => {
                    this.parentMessage.image = e.target.result;
                    this.parentMessage.filename = videoFile.name;
                    this.parentMessage.type = videoFile.name.split('.').pop();
                    if (this.parentMessage['thumbnail'] == undefined) {
                      this.parentMessage['thumbnail'] = '';
                    }
                    // this.writeFile(
                    //   e.target.result,
                    //   videoFile.name,
                    //   videoFile.type
                    // );
                  };
                  reader.readAsDataURL(videoFile);
                })
                .catch((error: any) => {
                  console.error('Error generating thumbnail:', error);
                });
            },
          },
          {
            text: 'Open Camera',
            handler: async () => {
              await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
              }).then(async (media: any) => {
                this.parentMessage.image = media.dataUrl;
                const iData = this.parentMessage.image.split(',')[1];
                const byteCharacters = atob(iData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                let imageBlob = new Blob([byteArray], { type: 'image/jpeg' });
                let imageUrl = URL.createObjectURL(imageBlob);
                const segments = imageUrl.split('/');
                this.parentMessage.filename =
                  segments.pop() + '.' + media.format;
                this.parentMessage.type = media.format;
                this.parentMessage['thumbnail'] = '';
              });
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((alert) => alert.present());
  }

  onStartRecordingOld() {
    this.audioData = {
      base64: null,
      duration: 0,
      fileName: '',
    };
    this.checkRecordingAbility();
    this.fileName =
      'record' +
      new Date().getDate() +
      new Date().getMonth() +
      new Date().getFullYear() +
      new Date().getHours() +
      new Date().getMinutes() +
      new Date().getSeconds() +
      '.mp3';
    VoiceRecorder.startRecording()
      .then((result: GenericResponse) => {
        this.parentMessage.type = '';
        this.parentMessage.image = '';
        this.parentMessage.filename = '';
        // this.parentMessage = true;
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.recordingTimer += 1;
          }, 1000);
        }
        this.error = false;
        this.audioData = {
          base64: null,
          duration: 0,
          fileName: this.fileName ?? '',
        };
      })
      .catch((error) => {
        this.error = true;
      });
  }

  onStopRecordingOld() {
    VoiceRecorder.stopRecording()
      .then((result: RecordingData) => {
        this.recording = false;
        if (this.timer) {
          clearInterval(this.timer);
        }
        const { mimeType, recordDataBase64, msDuration } = result.value;
        this.parentMessage.filename = this.fileName;
        this.parentMessage.type = 'mp3';
        this.error = false;
        this.audioData = {
          ...this.audioData,
          base64: `data:${mimeType};base64,${recordDataBase64}`,
          duration: Math.floor(msDuration / 1000),
          fileName: this.fileName ?? '',
        };
        this.parentMessage.image = recordDataBase64;
      })
      .catch((error) => {
        this.error = true;
      });
  }

  deletefile() {
    this.parentMessage.type = '';
    this.parentMessage.image = '';
    this.parentMessage.filename = '';
  }

  async onStartRecording(evt: any = '') {
    await this.audioService.startRecording();
    this.recording = true;
    this.startTime = Date.now();
    this.audioData = {
      fileName: '',
      base64: null,
      duration: 0,
    };
    this.startTimer();
  }

  async onStopRecording(evt: any = '') {
    this.stopTimer();
    this.parentMessage.filename = `audio_${new Date()
      .toISOString()
      .replace(/[:.]/g, '-')}.wav`;
    this.parentMessage.image = await this.audioService.stopRecording();
    this.audioData = {
      ...this.audioData,
      base64: this.parentMessage.image,
      duration: (Date.now() - this.startTime) / 1000,
      fileName: this.parentMessage.filename,
    };
    this.parentMessage.type = 'wav';
    console.log(this.audioData);
    console.log(this.parentMessage);
    this.recording = false;
  }

  startTimer() {
    this.runningTime = 0;
    this.timerInterval = setInterval(() => {
      this.runningTime = (Date.now() - this.startTime) / 1000;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  async cleanupRecording() {
    if (this.recording) {
      await this.audioService.stopRecording();
      this.recording = false;
    }
  }

  formatTime(duration: number) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';

    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;

    return ret;
  }

  checkimage(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (
        f != 'pdf' &&
        f != 'mp3' &&
        f != 'xls' &&
        f != 'xlsx' &&
        f != 'docx' &&
        f != 'wav' &&
        f != 'doc'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
    //image.url.split('.')[image.url.split('.').length-1]!='pdf'
  }

  checkmp4(f: any) {
    if (f) {
      let data = f.url != undefined ? f.url.split('.') : '';
      data =
        data != '' && data != undefined
          ? data[data.length - 1].toLowerCase()
          : '';
      if (data == 'mp4') {
        const urlParts = f['url'].split('/');
        const videoFilename = urlParts.pop();
        urlParts.push('thumb');
        const thumbnailFilename = videoFilename?.replace('.mp4', '.jpeg');
        urlParts.push(thumbnailFilename);
        f['thumbnail'] = urlParts.join('/');
        // f['thumbnail'] = this.select_datas['thumbnail'] != undefined && this.select_datas['thumbnail'] != ''? this.select_datas['thumbnail'] : '../../assets/imgs/appicon.png';
        if (f['videoClicked'] == undefined) {
          f['thumbnailBase64Image'] = true;
          f['videoClicked'] = false;
        }
        return true;
      } else {
        return false;
      }
    } else {
      f['thumbnail'] = '';
      if (f['videoClicked'] == undefined) {
        f['thumbnailBase64Image'] = true;
        f['videoClicked'] = false;
      }
      return true;
    }
  }

  checkmp3(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'mp3' || f == 'wav') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  loadVideo(data: any) {
    data.thumbnailBase64Image = false;
    data.videoClicked = true;
  }

  checkxls(fileData: any) {
    if (fileData) {
      fileData = fileData.split('.');
      fileData = fileData[fileData.length - 1].toLowerCase();
      if (fileData == 'xls' || fileData == 'xlsx') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkdocx(fileData: any) {
    if (fileData) {
      fileData = fileData.split('.');
      fileData = fileData[fileData.length - 1].toLowerCase();
      if (fileData == 'doc' || fileData == 'docx') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkpdf(fileData: any) {
    if (fileData) {
      fileData = fileData.split('.');
      fileData = fileData[fileData.length - 1].toLowerCase();
      if (fileData == 'pdf') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  openFile(path: any, data: any) {
    let ext: any = this.extention(path);
    let type: any = this.getMIMEtype(ext);
    var request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'blob';

    request.onloadend = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var reader = new FileReader();
          reader.onloadend = (e) => {
            if (reader.readyState === FileReader.DONE) {
              if (e.target && e.target.result) {
                this.writeFile(e.target.result, ext, type);
              } else {
                console.error('Error reading file data.');
              }
            }
          };
          reader.readAsDataURL(request.response);
        } else {
          console.error('Failed to load file. Status:', request.status);
        }
      }
    };
    request.send();
  }

  extention(url: any) {
    const parts = url.split('.');
    const lastPart = parts[parts.length - 1];
    const extension = lastPart.split('?')[0];
    return extension;
  }

  getMIMEtype(extn: any) {
    let ext: any = extn.toLowerCase();
    let MIMETypes: any = {
      txt: 'text/plain',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      doc: 'application/msword',
      pdf: 'application/pdf',
      jpg: 'image/jpg',
      jpeg: 'image/jpeg',
      bmp: 'image/bmp',
      png: 'image/png',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      rtf: 'application/rtf',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };
    return MIMETypes[ext];
  }

  writeFile(FileContents: any, FileName: any, FileType: any) {
    let blob = this.b64toBlob(FileContents, FileType);
    this.file
      .writeFile(this.file.dataDirectory, FileName, blob, { replace: true })
      .then((response: any) => {
        this.fileOpener.open(this.file.dataDirectory + FileName, FileType);
      })
      .catch((err: any) => {
        console.error('Error writing file:', err);
      });
  }

  b64toBlob(b64Data: any, contentType: any) {
    let index = String(b64Data).lastIndexOf(',');
    let data = String(b64Data).substring(index + 1);
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
