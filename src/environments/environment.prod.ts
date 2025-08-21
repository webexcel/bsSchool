export const environment = {
  production: true,
  senderID: '194329587171',
  login_logo: 'assets/imgs/appicon.png',
  school_name: 'B.S. Nursery and Primary School',
  app_versionCode: '4',
  apiBaseUrl: 'https://demo.schooltree.in/bs_school.php/api/',
  apiBaseUrlbill: 'http://sms.schooltree.in/bills/app/bs_school.php',
  version: '4',
  package: 'com.schooltree.bs',
  color: '#4475de',
  pages: [
    {
      title: 'circulars',
      url: '/circulars',
      icon: 'assets/imgs/Icons_new/Featured play list.png',
      filter:
        'invert(96%) sepia(27%) saturate(2344%) hue-rotate(287deg) brightness(83%) contrast(121%)',
      menu_icon: 'assets/imgs/dashboard/circular.png',
      borderColor: '#000000',
    },
    {
      title: 'homework',
      url: '/homework',
      icon: 'assets/imgs/Icons_new/Ereader.png',
      filter:
        'invert(15%) sepia(100%) saturate(2860%) hue-rotate(238deg) brightness(101%) contrast(170%)',
      menu_icon: 'assets/imgs/dashboard/homework1.png',
      borderColor: '#000000',
    },
    {
      title: 'report-card',
      url: '/report-card',
      icon: 'assets/imgs/Icons_new/Report Card (2).png',
      filter:
        'invert(10%) sepia(51%) saturate(5820%) hue-rotate(291deg) brightness(110%) contrast(115%)',
      menu_icon: 'assets/imgs/dashboard/reportcard.png',
      borderColor: '#000000',
    },
    {
      title: 'gallery',
      url: '/gallery',
      icon: 'assets/imgs/dashboard/gallery.png',
      filter:
        'invert(50%) sepia(24%) saturate(1477%) hue-rotate(1deg) brightness(106%) contrast(89%)',
      menu_icon: 'assets/imgs/dashboard/gallery1.png',
      borderColor: '#000000',
    },
    {
      title: 'exam-schedule',
      url: '/exam-schedule',
      icon: 'assets/imgs/Icons_new/Test Passed.png',
      filter:
        'invert(61%) sepia(99%) saturate(745%) hue-rotate(1deg) brightness(107%) contrast(103%)',
      menu_icon: 'assets/imgs/dashboard/examschedule.png',
      borderColor: '#000000',
    },

    {
      title: 'calender',
      url: '/calender',
      icon: 'assets/imgs/dashboard/Claender.png',
      filter:
        'invert(23%) sepia(97%) saturate(4292%) hue-rotate(28deg) brightness(98%) contrast(101%)',
      menu_icon: 'assets/imgs/dashboard/calender.png',
      borderColor: '#000000',
    },

    {
      title: 'attendance',
      url: '/attendance',
      icon: 'assets/imgs/Icons_new/attend.png',
      filter:
        'invert(22%) sepia(32%) saturate(6676%) hue-rotate(349deg) brightness(75%) contrast(81%)',
      menu_icon: 'assets/imgs/dashboard/Attendance1.png',
      borderColor: '#000000',
    },

    // { title: 'id-card',url: '/id-card', icon: 'assets/imgs/speakers/id-card.png', filter:"invert(81%) sepia(7%) saturate(3462%) hue-rotate(127deg) brightness(88%) contrast(90%)"},
    {
      title: 'profile',
      url: '/profile',
      icon: 'assets/imgs/dashboard/profile.png',
      menu_icon: 'assets/imgs/dashboard/profie1.png',
      filter:
        'invert(39%) sepia(99%) saturate(498%) hue-rotate(24deg) brightness(97%) contrast(101%)',
    },
    // { title: 'online-class',url: '/online-class', icon: 'assets/imgs/speakers/online-learning.png',filter:"invert(52%) sepia(98%) saturate(4236%) hue-rotate(345deg) brightness(99%) contrast(92%)"},
    {
      title: 'fee-details',
      url: '/payment',
      icon: 'assets/imgs/dashboard/payment.png',
      menu_icon: 'assets/imgs/dashboard/payment1.png',
      filter:
        'invert(10%) sepia(49%) saturate(6671%) hue-rotate(309deg) brightness(87%) contrast(103%)',
    },
    {
      title: 'timetable',
      url: '/timetable',
      icon: 'assets/imgs/Icons_new/Glossary.png',
      menu_icon: 'assets/imgs/Icons_new/Glossary.png',
      filter:
        'invert(26%) sepia(99%) saturate(5099%) hue-rotate(294deg) brightness(112%) contrast(131%)',
    },
    // {
    //   title: 'Leave Letter',
    //   url: '/leave-letter',
    //   icon: 'assets/imgs/Icons_new/leaveletter.svg',
    //   menu_icon: 'assets/imgs/Icons_new/leaveletter.svg',
    //   filter:
    //     'invert(26%) sepia(99%) saturate(5099%) hue-rotate(294deg) brightness(112%) contrast(131%)',
    // },
    // {
    //   title: 'Video Gallery',
    //   url: '/video-gallery',
    //   icon: 'assets/imgs/Icons_new/videoGal.svg',
    //   menu_icon: 'assets/imgs/Icons_new/videoGal.svg',
    //   filter:
    //     'invert(26%) sepia(99%) saturate(5099%) hue-rotate(294deg) brightness(112%) contrast(131%)',
    // },
    // {
    //   title: 'MCQ Exam',
    //   url: '/mcq',
    //   icon: 'assets/imgs/Icons_new/mcq.svg',
    //   menu_icon: 'assets/imgs/Icons_new/mcq.svg',
    //   filter:
    //     'invert(26%) sepia(99%) saturate(5099%) hue-rotate(294deg) brightness(112%) contrast(131%)',
    // },
    // {
    //   title: 'Apply Leave',
    //   url: '/leave',
    //   icon: 'assets/imgs/Icons_new/leave1.png',
    //   menu_icon: 'assets/imgs/Icons_new/leave1.png',
    //   borderColor: '#000000',
    // },
    {
      title: 'Knowledge Base',
      url: '/knowledge-base',
      icon: 'assets/imgs/Icons_new/classroom.png',
      menu_icon: 'assets/imgs/Icons_new/classroom.png',
      borderColor: '#000000',
    },

    {
      title: 'Parents Message',
      url: '/upload-videos',
      icon: 'assets/imgs/Icons_new/upload2.svg',
      menu_icon: 'assets/imgs/Icons_new/upload2.svg',
      filter:
        'invert(26%) sepia(99%) saturate(5099%) hue-rotate(294deg) brightness(112%) contrast(131%)',
    },

    {
      title: 'language',
      url: '/language',
      icon: 'assets/imgs/dashboard/language1.png',
      menu_icon: 'assets/imgs/dashboard/language1.png',
      filter:
        'invert(10%) sepia(98%) saturate(6683%) hue-rotate(247deg) brightness(62%) contrast(131%)',
    },
  ],
};
