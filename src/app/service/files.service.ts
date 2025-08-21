import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(
    private file: File,
    private platform: Platform,
    private auth: AuthService
  ) {
    this.platform.ready().then(() => {
      this.checkdir();
    });
  }

  checkdir() {
    try {
      this.file
        .checkDir(this.file.externalDataDirectory, 'schooltree')
        .then((response) => {})
        .catch((err) => {
          this.file
            .createDir(this.file.externalDataDirectory, 'schooltree', false)
            .then((response) => {})
            .catch((err) => {});
        });
    } catch (error) {}
  }

  checkfile(filename: any) {
    return this.file.checkFile(
      this.file.externalDataDirectory,
      'schooltree/' + filename
    );
  }

  read(file: any) {
    return this.file.readAsDataURL(
      this.file.externalDataDirectory,
      'schooltree/' + file
    );
  }

  removefile(file: any) {
    try {
      this.file
        .removeFile(this.file.externalDataDirectory, 'schooltree/' + file)
        .then(
          (res) => {},
          (err) => {}
        );
    } catch (error) {}
  }

  download(filename: any, imag: any) {
    /// contentType = image/png
    //let imag = `base64`

    let realData = imag.split(',')[1];
    let contentType = imag.split(',')[0].replace(';base64', '');
    contentType = contentType.replace('data:', '');
    let blob = this.b64toBlob(realData, contentType);
    try {
      return this.file.writeFile(
        this.file.externalDataDirectory,
        'schooltree/' + filename,
        blob
      );
    } catch (error) {
      return false;
    }
  }

  b64toBlob(b64Data: any, contentType: any) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
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
