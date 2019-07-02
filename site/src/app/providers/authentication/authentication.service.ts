import { Injectable } from '@angular/core';
import { AngularFlamelink } from 'angular-flamelink';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {

	constructor(
		private flamelink: AngularFlamelink,
		private functions: AngularFireFunctions,
	) { }

	public refreshTokenOnAuthStateChange() {
		return this.flamelink.auth.authState.subscribe(
			async user => {
				if (user) {
					await this.functions.httpsCallable('refreshToken')({});
					await user.getIdTokenResult(true);
				}
			}
		);
	}

}
