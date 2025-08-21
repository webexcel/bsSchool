import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-mcq',
  templateUrl: './mcq.page.html',
  styleUrls: ['./mcq.page.scss'],
})
export class McqPage implements OnInit {
  backButtonSubscription: any; exams: any; examQuestions: any; presentView: any; questionList: any[] = [];
  totalQuestions: any; totalMarks: any; gainedMark: any; selectedQuestion: any; selectedQuestionIndex: any;
  timeLeft: number; interval: any; minutes: number; seconds: number; showCard: boolean = false; currentExam: any;
  classId: any; questionHistory: any[] = []; adno: any; currentQuesId: any; quesScore: any;

  constructor(private platform: Platform, private router: Router, private toastController: ToastController,
    public loading: LoadingService, public authservice: AuthService, public storage: StorageService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/dashboard']);
    });
    this.presentView = "examList";
    this.questionList = [];
    this.currentExam = [];
    let getStudentDetails = this.storage.getjson('studentDetail');
    this.adno = getStudentDetails[0] != undefined && getStudentDetails[0].ADNO != undefined ? getStudentDetails[0].ADNO : "";
    this.classId = getStudentDetails[0] != undefined && getStudentDetails[0].CLASS_ID != undefined ? getStudentDetails[0].CLASS_ID : "";
    this.getExamDetails();
    this.exams = [];
    this.currentQuesId = "";
  }

  ionViewWillLeave() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  selected(event: any) {
    this.presentView = "examList";
    this.questionList = [];
    this.currentExam = [];
    this.adno = event.ADNO;
    this.classId = event.CLASS_ID;
    this.getExamDetails();
    this.exams = [];
    this.currentQuesId = "";
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

  getExamDetails() {
    this.loading.present();
    this.authservice.post('getExamDetails', {"classid": "1"}).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        if (result['status']) {
          this.exams = result["data"];
          this.getStatus();
        }
      },
      (err: any) => {
        this.loading.dismissAll();
      }
    );
  }

  getStatus() {
    this.loading.present();
    let ids: any = [];
    this.exams.forEach((element: any) => {
      ids.push(element.qus_paper_id);
    });
    this.authservice.post('getExamStatus', {"adno": this.adno, qus_paper_id: ids}).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        if (result['status']) {
          let data = result["data"];
          for (let i = 0; i < this.exams.length; i++) {
            if (this.exams[i].qus_paper_id == data[i].qus_paper_id) {
              this.exams[i]["examStatus"] = data[i].message;
            } else {
              this.exams[i]["examStatus"] = "PENDING";
            }
          }
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

    return dd + '-' + mm + '-' + yyyy;
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.minutes = Math.floor(this.timeLeft / 60);
        this.seconds = this.timeLeft % 60;
      } else {
        this.showToast("Time Up!", "danger");
        this.endExam();
      }
    }, 1000);
  }

  endExam() {
    this.submitExam();
    clearInterval(this.interval);
  }

  startExam(data: any) {
    this.loading.present();
    this.currentQuesId = data.qus_paper_id;
    this.authservice.post('getExamStart', {"qus_paper_id": data.qus_paper_id}).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        if (result['status']) {
          this.examQuestions = result["data"];
          for(let i = 0; i < this.examQuestions.length; i++) {
            this.examQuestions[i]["studentChoice"] = "";
            this.examQuestions[i]["studentAns"] = "";
            this.examQuestions[i]["studentAnsStatus"] = "pending";
          }
          this.questionList = this.examQuestions;
          this.currentExam = data;
          this.selectedQuestion = this.examQuestions[0];
          this.selectedQuestionIndex = 0;
          this.showCard = true;
          this.presentView = "questionView";
        }
      },
      (err: any) => {
        this.loading.dismissAll();
      }
    );
    // this.currentExam = data;
    // this.presentView = "questionView";
    // this.questionList = this.examQuestions[subName];
    // this.selectedQuestion = this.examQuestions[0];
    // this.selectedQuestionIndex = 0;
    // this.totalQuestions = this.questionList.length;
    // this.totalMarks = 0;
    // this.questionList.forEach(element => {
    //   this.totalMarks+= element.mark;
    // });
    // this.showCard = true;
    // this.gainedMark = 0;
    // this.timeLeft = data.duration * 60;
    // this.minutes = 0;
    // this.seconds = 0;
    // this.startTimer();
  }

  selectedOpt(ans: any, opt: any) {
    this.examQuestions[this.selectedQuestionIndex].studentChoice = opt;
    this.examQuestions[this.selectedQuestionIndex].studentAns = ans;
    this.examQuestions[this.selectedQuestionIndex].studentAnsStatus = "answered";
  }

  submitExam() {
    this.loading.present();
    let reqData: any = [];
    this.examQuestions.forEach((element: any) => {
      reqData.push({qus_id: element.qus_id, correct_ans: element.correct_opt, attend: element.studentChoice});
    });
    this.authservice.post('insertExamAttend', {adno: this.adno, qus_paper_id: this.currentQuesId, data: reqData}).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        if (result['status']) {
          clearInterval(this.interval);
          this.getExamDetails();
          this.showToast("Exam Submitted Successfully.", "success");
          this.presentView = "examList";
          this.currentQuesId = "";

          // this.presentView = "resultView";
          // this.gainedMark = 0;
          // this.questionList.forEach(element => {
          //   if (element.studentAns == element.answer) {
          //     this.gainedMark += element.mark;
          //   }
          // });
        }
      },
      (err: any) => {
        this.loading.dismissAll();
      }
    );
  }

  closeResult() {
    this.presentView = "examList";
    this.currentExam = [];
    this.questionHistory = [];
  }

  selectQuestion(index: any) {
    this.showCard = false;
    setTimeout(() => {
      if (this.examQuestions[this.selectedQuestionIndex].studentAnsStatus == "pending") {
        this.examQuestions[this.selectedQuestionIndex].studentAnsStatus = "skipped";
      }
      this.selectedQuestion = this.examQuestions[index];
      this.selectedQuestionIndex = index;
      this.showCard = true;
      for(let i = 0; i < index; i++) {
        if (this.examQuestions[i].studentAnsStatus == "pending") {
          this.examQuestions[i].studentAnsStatus = "skipped";
        }
      }
    }, 300);
  }

  historyExam(data: any) {
    this.loading.present();
    this.currentQuesId = data.qus_paper_id;
    this.authservice.post('getMcqExamResult', {"adno": this.adno, "qus_paper_id": data.qus_paper_id}).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        this.presentView = "examHistory";
        this.quesScore = result["Result"][0];
        this.quesScore["qus_paper_name"] = data.qus_paper_name;
        this.quesScore["sub_name"] = data.sub_name;
        this.questionHistory = result["DetailedResult"];
      },
      (err: any) => {
        this.loading.dismissAll();
      }
    );
  }
}
