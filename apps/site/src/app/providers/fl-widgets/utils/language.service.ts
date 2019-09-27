import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FLLanguageService {

  public valueChanges = new Observable<string>(observer => {
    observer.next('en-US');
  })

}

