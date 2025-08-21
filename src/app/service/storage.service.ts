import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {
        
  }

  add(key:any, data:any){
      localStorage.setItem(key,data)
  }

  addjson(key:any, data:any){
      localStorage.setItem(key,JSON.stringify(data))
  }

  get(key:any){
      return localStorage.getItem(key)
  }

  getjson(key: any) {
    const storedData = localStorage.getItem(key);
    
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      // Return a default value or handle the case of no data
      return null; // or return an empty object or array, as needed
    }
  }
  

  remove(key:any){
      localStorage.removeItem(key)
  }

  clear(){
      localStorage.clear()
  }
}
