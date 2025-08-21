import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { SelectModalComponent } from '../select-modal/select-modal.component';
import { AudioProcessingService } from '../service/audio-processing-service';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { VideoProcessingService } from '../service/video-processing-service';

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.page.html',
  styleUrls: ['./knowledge-base.page.scss'],
})
export class KnowledgeBasePage implements OnInit {
  presentView: any; classList: any[] = []; subList: any[] = []; topicList: any[] = []; class: any; ClassName: any;
  subject: any; SubjectName: any; topic: any; TopicName: any; description: any; thumbData: any; startTime: any;
  runningTime: number = 0; timerInterval: any; recording: boolean = false; error: any = false; allKBRecords: any;
  selectedDate: any; selectedClass: any; selectedSubject: any; selectedTopic: any; currentId: any; initialIndex: any;
  finalIndex: any; totalSize: any; incrementSize: any; currentSize: any; isPickerOpen: boolean = false;
  classTopicResult: any; subjectTopicResult: any; classTopValue: any; classTopName: any; subjectTopValue: any;
  subjectTopName: any; topicText: any; enableTopic: boolean = true; currentIndex: any; subView: any; classData: any;
  optionList: any[] = []; filteredData: any[] = []; subjectData: any; topicData: any; detailsData: any;
  backButtonSubscription: any; topicOptionList: any[] = []; classShare: any; ClassShareName: any; sharingData: any;
  audioData: {
    fileName: string;
    base64: "" | null;
    duration: number;
  } = {
      fileName: '',
      base64: null,
      duration: 0,
    };

  constructor(public alertCtrl: AlertController, public modalController: ModalController, public storage: StorageService,
    public loading: LoadingService, public authservice: AuthService, private audioService: AudioProcessingService,
    private videoService: VideoProcessingService, public toastController: ToastController, private file: File,
    private fileOpener: FileOpener, private filePath: FilePath, public platform: Platform, public router: Router
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.presentView = "main";
    this.subView = "class";
    this.classList = this.storage.getjson('classlist');
    this.getallsubject();
    this.reset();
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.presentView == "main" && this.subView == "subject") {
        this.subView == "class";
      } else if (this.presentView == "main" && this.subView == "topic") {
        this.subView == "subject";
      } else if (this.presentView == "main" && this.subView == "options") {
        this.subView == "topic";
      } else if (this.presentView == "main" && this.subView == "data") {
        this.subView == "options";
      } else if (this.presentView == "addForm" || this.presentView == "editForm") {
        this.close();
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ionViewWillLeave() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  reset() {
    this.selectedDate = new Date().toISOString();
    this.class = "";
    this.ClassName = "No Class Selected";
    this.selectedClass = "";
    this.subject = "";
    this.SubjectName = "No Subject Selected";
    this.selectedSubject = "";
    this.topic = "";
    this.TopicName = "No Topic Selected";
    this.selectedTopic = "";
    this.description = "";
    this.thumbData = {};
    this.thumbData["image"] = '';
    this.thumbData["type"] = '';
    this.thumbData["filename"] = '';
    this.thumbData["thumbnail"] = '';
    this.recording = false;
    this.allKBRecords = [];
    this.currentId = undefined;
    this.incrementSize = 10;
    this.initialIndex = 0;
    this.finalIndex = this.initialIndex + this.incrementSize - 1;
    this.totalSize = 0;
    this.currentSize = 0;
    this.isPickerOpen = false;
    this.currentIndex = -1;
    // this.getcurrentRecord();
  }

  getcurrentRecord() {
    this.loading.present();
    this.authservice
      .post('getKBDataDatewise', { startIndex: this.initialIndex, endIndex: this.finalIndex })
      .subscribe(
        (res: any) => {
          this.loading.dismissAll();
          if (res['status']) {
            for (let i = 0; i < res["data"].length; i++) {
              this.allKBRecords.push(res["data"][i]);
            }
            this.totalSize = res["totalCount"];
            this.currentSize = this.currentSize + res["data"].length;

            this.allKBRecords.forEach((element: any) => {
              element["isOptionsModalOpen"] = false;
            });
          }
        },
        (err: any) => {
          this.loading.dismissAll();
        }
      );
  }

  doInfinite(event: any) {
    this.initialIndex = this.finalIndex + 1;
    this.finalIndex = this.finalIndex + this.incrementSize;
    // this.getcurrentRecord();
    this.getOptionDetails(this.detailsData);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  presentButtons(index: any) {
    this.allKBRecords[index].isOptionsModalOpen = true;
  }

  closeOptionsModal(evt: any, index: any) {
    if (index != '-1') {
      this.allKBRecords[index].isOptionsModalOpen = false;
      this.modalController.dismiss();
    }
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'middle',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  editAction(index: any) {
    this.closeOptionsModal("", index);
    this.enableTopic = true;
    this.selectedDate = this.allKBRecords[index].baseDate;
    this.selectedClass = this.classList.filter((item: any) => item.name === this.allKBRecords[index].class)[0];
    this.class = this.selectedClass.id;
    this.ClassName = this.allKBRecords[index].class + " Class Selected";
    this.selectedSubject = this.subList.filter((item: any) => item.name === this.allKBRecords[index].subject)[0];
    this.subject = this.selectedSubject.id;
    this.SubjectName = this.allKBRecords[index].subject + " Subject Selected";
    this.currentIndex = index;
    this.getTopics("edit", index);
  }

  async deleteAction(index: any) {
    this.loading.present();
    this.authservice
      .post("deleteRecordOfKB", { id: this.allKBRecords[index].id })
      .subscribe(
        (res: any) => {
          this.loading.dismissAll();
          if (res['status']) {
            this.modalController.dismiss();
            this.allKBRecords = [];
            this.presentView = "main";
            if (this.subView == "data") {
              this.subView = "options";
            }
            this.reset();
            // this.getcurrentRecord();
          }
        },
        (err: any) => {
          this.loading.dismissAll();
        }
      );
  }

  shareAction(index: any) {
    this.closeOptionsModal("", index);
    this.presentView = "share";
    let sharedClasses = this.allKBRecords[index].shareWith == null ? "" : this.allKBRecords[index].shareWith;
    this.classShare = this.classList.filter((item: any) => sharedClasses?.includes(item.name));
    this.ClassShareName = this.classShare.length + " Classes Selected";
    this.sharingData = this.allKBRecords[index];
  }

  newMessage() {
    this.currentId = undefined;
    this.reset();
    this.presentView = "addForm";
  }

  async saveMessage(evt: any) {
    if (this.selectedClass == undefined || this.selectedClass == null || this.selectedClass == "" || this.selectedClass.name == undefined || this.selectedClass.name == "") {
      this.showToast("No Class Selected!", "danger");
    } else if (this.selectedSubject == undefined || this.selectedSubject == null || this.selectedSubject == "" || this.selectedSubject.name == undefined || this.selectedSubject.name == "") {
      this.showToast("No Subject Selected!", "danger");
    } else if (this.selectedTopic == undefined || this.selectedTopic == null || this.selectedTopic == "" || this.selectedTopic.topic == undefined || this.selectedTopic.topic == "") {
      this.showToast("No Topic Selected!", "danger");
    } else {
      let msgEvt = evt == "add" ? "submit" : "update";
      let alert = await this.alertCtrl.create({
        header: "Do you want to " + msgEvt + "?",
        mode: "ios",
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: "Yes",
            handler: () => {
              this.loading.present();
              let url;
              if (evt == "add") {
                url = "newRecordOfKB";
              } else if (evt == "edit") {
                url = "updateRecordOfKB";
              }
              this.authservice
                .post(url, {
                  date: this.selectedDate, subId: this.selectedSubject, classId: this.selectedClass,
                  topic: this.selectedTopic, describ: this.description, fileName: this.thumbData["filename"],
                  fileContent: this.thumbData["image"], thumbnail: this.thumbData["thumbnail"],
                  type: this.thumbData["type"], staffId: this.storage.getjson("teachersDetail")[0].staff_id,
                  id: this.currentId
                })
                .subscribe(
                  (res: any) => {
                    this.loading.dismissAll();
                    if (res['status']) {
                      this.presentView = "main";
                      if (this.subView == "data") {
                        this.subView = "options";
                      }
                      this.reset();
                    }
                  },
                  (err: any) => {
                    this.loading.dismissAll();
                  }
                );
            },
          },
        ],
      });
      await alert.present();
    }
  }

  close() {
    this.presentView = "main";
    if (this.subView == "data") {
      this.subView = "options";
    }
    this.reset();
  }

  async openOptions(data: any, value: any, bind: any, multi: any, param = ['id', 'name']) {
    const modal = await this.modalController.create({
      component: SelectModalComponent,
      componentProps: {
        optionsList: data,
        value: value,
        multi: multi,
        parameters: param,
      },
    });

    modal.onDidDismiss().then((result: any) => {
      if (multi) {
        let datar = [];
        if (result.data != undefined) {
          for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].checked) {
              datar.push(result.data[i]);
            }
          }
        }
        if (bind == 'ClassMulti') {
          console.log(this.classShare);
          this.classShare = datar;
          this.ClassShareName =
            datar.length > 0
              ? datar.length + ' Students Selected'
              : 'No Students Selected';
        }
      } else {
        if (bind == "Class") {
          this.selectedClass = result.data;
          this.class = result.data.id;
          this.ClassName =
            result.data.name != undefined && result.data.id != 0
              ? result.data.name
              : 'No Class Selected';
          this.enableTopic = true;
          this.topicList = [];
          if (this.selectedClass != "" && this.selectedSubject != "") {
            this.getTopics("", this.currentIndex);
          }
        } else if (bind == "Subject") {
          this.selectedSubject = result.data;
          this.subject = result.data.id;
          this.SubjectName =
            result.data.name != undefined && result.data.id != 0
              ? result.data.name
              : 'No Subject Selected';
          this.enableTopic = true;
          this.topicList = [];
          if (this.selectedClass != "" && this.selectedSubject != "") {
            this.getTopics("", this.currentIndex);
          }
        } else if (bind == "Topic") {
          this.selectedTopic = result.data;
          this.topic = result.data.id;
          this.TopicName =
            result.data.topic != undefined && result.data.id != 0
              ? result.data.topic
              : 'No Topic Selected';
        } else if (bind == "ClassTop") {
          this.classTopicResult = result.data;
          this.classTopValue = result.data.id;
          this.classTopName = result.data.name != undefined && result.data.id != 0
            ? result.data.name
            : 'No Class Selected';
        } else if (bind == "SubjectTop") {
          this.subjectTopicResult = result.data;
          this.subjectTopValue = result.data.id;
          this.subjectTopName = result.data.name != undefined && result.data.id != 0
            ? result.data.name
            : 'No Subject Selected';
        }
      }
    });
    return await modal.present();
  }

  getallsubject() {
    this.loading.present();
    this.authservice.get('getallsubject').subscribe(
      (res: any) => {
        this.loading.dismissAll();
        if (res['status']) {
          this.subList = res['data'];
        }
      },
      (err: any) => {
        this.loading.dismissAll();
      }
    );
  }

  formatDate(date: Date = new Date()) {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    let mm = `${today.getMonth() + 1}`;
    let dd = `${today.getDate()}`;

    if (+dd < 10) {
      dd = '0' + dd;
    }
    if (+mm < 10) {
      mm = '0' + mm;
    }

    return dd + '/' + mm + '/' + yyyy;
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
                    if (videoFile.size > 50 * 1024 * 1024) {
                      this.showToast(`File size exceeds 5 MB limit.`, "danger");
                      return;
                    }
                    this.videoService.uploadVideo(this.thumbData, videoFile);
                    this.videoService
                      .generateThumbnail(videoFile)
                      .then((thumbnailData) => {
                        this.thumbData["thumbnail"] = thumbnailData;
                      })
                      .catch((error) => {
                        console.error('Error generating thumbnail:', error);
                      });
                  }
                  const reader = new FileReader();
                  reader.onload = async (e: any) => {
                    this.thumbData.image = e.target.result;
                    this.thumbData.filename = videoFile.name;
                    this.thumbData.type = videoFile.name.split('.').pop();
                    if (this.thumbData['thumbnail'] == undefined) {
                      this.thumbData['thumbnail'] = '';
                    }
                    this.writeFile(
                      e.target.result,
                      videoFile.name,
                      videoFile.type
                    );
                  };
                  reader.readAsDataURL(videoFile);
                })
                .catch((error) => {
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
              }).then(async (media) => {
                this.thumbData.image = media.dataUrl;
                const iData = this.thumbData.image.split(',')[1];
                const byteCharacters = atob(iData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                let imageBlob = new Blob([byteArray], { type: 'image/jpeg' });
                let imageUrl = URL.createObjectURL(imageBlob);
                const segments = imageUrl.split('/');
                this.thumbData.filename =
                  segments.pop() + '.' + media.format;
                this.thumbData.type = media.format;
                this.thumbData['thumbnail'] = '';
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

  async onStartRecording() {
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

  async onStopRecording() {
    this.stopTimer();
    this.thumbData.filename = `audio_${new Date().toISOString().replace(/[:.]/g, '-')}.wav`;
    this.thumbData.image = await this.audioService.stopRecording();
    this.audioData = {
      ...this.audioData,
      base64: this.thumbData.image,
      duration: (Date.now() - this.startTime) / 1000,
      fileName: this.thumbData.filename,
    };
    this.thumbData.type = "wav";
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
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    let ret = '';
    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  }

  deletefile() {
    this.thumbData.type = '';
    this.thumbData.image = '';
    this.thumbData.filename = '';
  }

  checkimage(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f != 'pdf' && f != 'mp3' && f != 'xls' && f != 'xlsx' && f != 'mp4') {
        return true;
      } else {
        return false;
      }
    } else {
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

  checkxls(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'xls' || f == 'xlsx') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkpdf(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'pdf') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkdoc(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'doc' || f == 'docx') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkmp4(f: any) {
    if (f) {
      let data = f.filePath != undefined ? f.filePath.split('.') : '';
      data =
        data != '' && data != undefined
          ? data[data.length - 1].toLowerCase()
          : '';
      if (data == 'mp4') {
        const urlParts = f['filePath'].split('/');
        const videoFilename = urlParts.pop();
        urlParts.push('thumb');
        const thumbnailFilename = videoFilename?.replace('.mp4', '.jpeg');
        urlParts.push(thumbnailFilename);
        f['thumbnail'] = urlParts.join('/');
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

  loadVideo(data: any) {
    data.thumbnailBase64Image = false;
    data.videoClicked = true;
  }

  getfilename(f: any) {
    f = f.split('/');
    f = f[f.length - 1];
    return f;
  }

  getTopics(evt: any, index: any) {
    this.loading.present();
    this.authservice.post('getSubjectTopicListClass', { classid: this.selectedClass.id, sub_id: this.selectedSubject }).subscribe(
      (res: any) => {
        this.loading.dismissAll();
        if (res["status"]) {
          this.topicList = res["qus_paper"];
          this.enableTopic = false;
          if (evt == "edit") {
            this.selectedTopic = this.topicList.filter((item: any) => item.topic === this.allKBRecords[index].topic)[0];
            this.topic = this.selectedTopic.id;
            this.TopicName = this.allKBRecords[index].topic + " Topic Selected";
            this.description = this.allKBRecords[index].description;
            this.thumbData = {};
            this.thumbData["filename"] = this.allKBRecords[index].fileName;
            this.thumbData["filePath"] = this.allKBRecords[index].filePath;
            this.thumbData["image"] = "";
            this.thumbData["thumbnail"] = "";
            this.thumbData["type"] = "";
            this.recording = false;
            this.currentId = this.allKBRecords[index].id;
            this.presentView = "editForm";
          } else {
            this.selectedTopic = "";
            this.topic = "";
            this.TopicName = "No Topic Selected";
          }
        } else {
          this.topicList = [];
          this.enableTopic = true;
          this.selectedTopic = "";
          this.topic = "";
          this.TopicName = "No Topic Selected";
        }
      }, (err) => {
        this.loading.dismissAll();
      }
    );
  }

  addTopic() {
    this.isPickerOpen = true;
    this.classTopicResult = "";
    this.subjectTopicResult = "";
    this.classTopValue = "";
    this.subjectTopValue = "";
    this.topicText = "";
    this.classTopName = "No Class Selected";
    this.subjectTopName = "No Subject Selected";
  }

  confirm() {
    this.loading.present();
    this.authservice.post('saveTopic', {
      "sub_id": this.subjectTopicResult.id,
      "sub_name": this.subjectTopicResult.name,
      "topic": this.topicText,
      "class": [this.classTopicResult]
    }).subscribe(
      (res: any) => {
        this.loading.dismissAll();
        this.classTopicResult = "";
        this.subjectTopicResult = "";
        this.classTopValue = "";
        this.subjectTopValue = "";
        this.topicText = "";
        this.classTopName = "No Class Selected";
        this.subjectTopName = "No Subject Selected";
        this.cancel();
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }

  cancel() {
    this.isPickerOpen = false;
    this.modalController.dismiss();
  }

  getClassDetails(data: any) {
    this.subView = "subject";
    this.classData = data;
    this.topicOptionList = [];
    // this.loading.present();
    // this.authservice.post('getClassDetails', {
    //   class: data.id
    // }).subscribe(
    //   (res: any) => {
    //     this.loading.dismissAll();
    //     this.subView = "subject";
    //   },
    //   (err: any) => {
    //     this.loading.dismissAll();
    //   }
    // );
  }

  getSubjectDetails(data: any) {
    this.loading.present();
    this.authservice.post('getSubjectTopicListClass', {
      classid: this.classData.id,
      sub_id: data
    }).subscribe(
      (res: any) => {
        this.loading.dismissAll();
        this.subjectData = data;
        this.subView = "topic";
        this.topicOptionList = res["qus_paper"];
      },
      (err: any) => {
        this.loading.dismissAll();
      }
    );
  }

  getTopicDetails(data: any) {
    this.loading.present();
    this.subView = "options";
    this.topicData = data;
    this.optionList = [{ id: 1, name: "Images" }, { id: 2, name: "Videos" }, { id: 3, name: "PDF" },
    { id: 4, name: "Excel" }, { id: 5, name: "Word" }, { id: 6, name: "Audio" },
    { id: 7, name: "Messages" }];
    this.incrementSize = 10;
    this.initialIndex = 0;
    this.finalIndex = this.initialIndex + this.incrementSize - 1;
    this.totalSize = 0;
    this.currentSize = 0;
    this.allKBRecords = [];
    this.loading.dismissAll();
  }

  getOptionDetails(data: any) {
    this.loading.present();
    this.authservice.post('getKBDataDatewise', { startIndex: this.initialIndex, endIndex: this.finalIndex, format: data.name, class: this.classData.name, subject: this.subjectData.name }).subscribe(
      (res: any) => {
        this.loading.dismissAll();
        this.subView = "data";
        this.detailsData = data;
        for (let i = 0; i < res["data"].length; i++) {
          this.allKBRecords.push(res["data"][i]);
        }
        this.totalSize = res["totalCount"];
        this.currentSize = this.currentSize + res["data"].length;
        this.allKBRecords.forEach((element: any, index: any) => {
          element["isOptionsModalOpen"] = false;
          element["index"] = index;
        });
      },
      (err: any) => {
        this.loading.dismissAll();
      }
    );
  }

  closeView(view: any) {
    if (view == "subject") {
      this.subView = "class";
    } else if (view == "topic") {
      this.subView = "subject";
    } else if (view == "options") {
      this.subView = "topic";
    } else if (view == "data") {
      this.subView = "options";
      this.incrementSize = 10;
      this.initialIndex = 0;
      this.finalIndex = this.initialIndex + this.incrementSize - 1;
      this.totalSize = 0;
      this.currentSize = 0;
      this.allKBRecords = [];
    }
  }

  shareMessage() {
    this.loading.present();
    let classes = "";
    for (let i = 0; i < this.classShare.length; i++) {
      if (i + 1 == this.classShare.length) {
        classes += this.classShare[i].name;
      } else {
        classes += this.classShare[i].name + ",";
      }
    }
    this.authservice.post('shareKBData', { id: this.sharingData.id, classes: classes }).subscribe(
      (res: any) => {
        this.loading.dismissAll();
        this.close();
      },
      (err: any) => {
        this.loading.dismissAll();
      }
    );
  }

}
