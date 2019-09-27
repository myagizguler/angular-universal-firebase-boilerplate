import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFlamelink } from 'angular-flamelink';
import { DocumentReference } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FLMediaService {

  constructor(
    private flamelink: AngularFlamelink
  ) { }

  public async getFolder(name: string) {
    return this.flamelink.angularFire
      .collection('fl_folders', q => q.where('name', '==', name))
      .valueChanges()
      .pipe(first())
      .toPromise().then(
        result => {
          if (result && result[0]) {
            return result[0] as DocumentReference;
          } else {
            return this.flamelink.angularFire.collection('fl_folders').add({ name }).then(
              folderRef => folderRef.update({
                id: folderRef.id,
                uuid: folderRef.id,
                parentId: this.flamelink.angularFire.collection('fl_forders').doc('root').ref,
                _fl_meta_: {
                  createdBy: 'UNKNOWN',
                  createdDate: new Date(),
                  docId: folderRef.id,
                  lastModifiedBy: 'UNKNOWN',
                  lastModifiedDate: new Date()
                }
              }).then(
                () => folderRef
              )

            )
          }
        }
      )
  }

  public uploadFile(file: File, schemaKey?: string) {
    return new Observable<ProgressFile>(observer => {

      const data: ProgressFile = {
        label: 'Uploading: ' + file.name + '(' + file.size + ')',
        imageUrl: null,
        value: null,
      };
      observer.next(data);

      if (file.type.indexOf('image') === 0) {
        this.getBlob(file).then(blob => {
          data.imageUrl = blob,
            observer.next(data);
        });
      }

      this.getFolder(schemaKey).then(folderRef => {

        console.log(schemaKey);
        this.flamelink.storage.upload(file, {
          folderId: folderRef.id
        }).then(
          success => {
            data.progress = 100;
            data.value = this.flamelink.storage.fileRef(success.id);
            observer.next(data);
            observer.complete();
          },
          error => {
            console.log(error);
            observer.error(error);
            observer.complete();
          }
        );
      })



    });

  }

  public getBlob(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        // tslint:disable-next-line:no-string-literal
        resolve(event.target['result'] as string);
      };
      fileReader.readAsDataURL(file);

    });
  }

}


export interface ProgressFile {
  label?: string;
  imageUrl?: string;
  value?: DocumentReference;
  progress?: number;
}
