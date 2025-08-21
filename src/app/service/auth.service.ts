import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiBaseUrl: any = environment.apiBaseUrl;
  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  post(url: any, data: any) {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    let options = {
      headers: httpHeaders,
    };

    return this.http.post(`${this.apiBaseUrl}${url}`, data, {});
  }

  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  get(url: any) {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    let options = {
      headers: httpHeaders,
    };

    return this.http.get(url, options);
  }

  pdfto64(pdf: any) {
    let promise = new Promise((resolve, reject) => {
      let httpHeaders = new HttpHeaders().set('type', 'application/pdf');
      let options = {
        headers: httpHeaders,
      };
      this.http
        .get(pdf, options)
        .toPromise()
        .then(
          (res) => {},
          (err) => {}
        );
    });
    return promise;
  }

  isiso() {
    if (this.platform.is('ios')) {
      return true;
    } else {
      return false;
    }
  }

  getday(d: any) {
    d = new Date(d);
    return d.getDate();
  }

  getshormonth(d: any) {
    d = new Date(d);
    return d.toLocaleString('default', { month: 'short' });
  }

  open(url: any) {
    const options: InAppBrowserOptions = {
      zoom: 'no',
    };
    const browser = this.iab.create(url, '_system', options);
    browser.on('loadstart');
  }

  urlify(text: any) {
    var urlRegex =
      /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
    return text.replace(urlRegex, function (url: any) {
      let u = url;
      if (u.indexOf('http') == -1) {
        u = 'http://' + u;
      }
      return '<a href="' + u + '" target="_blank">' + url + '</a>';
    });
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  extractUrl(text: string) {
    var urlRegex =
      /(https?:\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)|((?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
    return text.replace(urlRegex, function (url) {
      return (
        '<a href="' +
        (url.startsWith('http') ? url : 'http://' + url) +
        '" target="_blank">' +
        url +
        '</a>'
      );
    });
  }
  // containsLink(text: string): boolean {
  //   var urlRegex =
  //     /(https?:\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)|((?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
  //   return urlRegex.test(text);
  // }

  linksAndMails(text: any) {
    const urlRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/[^\s]+)|www\.[^\s]+)/gi;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  
    return text
      .replace(urlRegex, function (url: string) {
        let u = url;
        if (!u.startsWith('http')) {
          u = 'http://' + u;
        }
        return `<a href="${u}" target="_blank">${url}</a>`;
      })
      .replace(emailRegex, function (email: string) {
        return `<a href="mailto:${email}">${email}</a>`;
      });
  }
}
