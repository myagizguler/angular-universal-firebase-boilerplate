import universal from './universal/server-function';
import { flConfig, flSearchFireFunction } from 'flamelink-text-search';
import { firebaseApp, functions, firestore } from './firebase';

export const ssr = universal;

flConfig(firebaseApp);
export const search = flSearchFireFunction;

export const refreshToken = functions.https.onCall(async (data, context) => {
	if (context.auth && context.auth.uid) {
		const user = await firestore.collection('fl_users').doc(context.auth.uid).get();
		const permissionsRef = user.data().permissions;
		const permissionsId = permissionsRef ? permissionsRef.id : '0';
		const permissions = permissionsRef ? await permissionsRef.get() : null;
		const mediaPermissions = permissions ? permissions.data().media : {};
		await firebaseApp.auth()
			.setCustomUserClaims(context.auth.uid, {
				permissions: permissionsId,
				mediaPermissions
			});
		return;
	}
});

export const subscribe = functions.https.onCall(async (data, context) => {
	const subscription = await firestore
		.collection('fl_content')
		.where('_fl_meta_.schema', '==', 'subscriptions')
		.where('emailAddress', '==', data.emailAddress).get();

	if (subscription.docs.length <= 0) {
		return await firestore
			.collection('fl_content')
			.add({
				emailAddress: data.emailAddress
			}).then(ref => ref.update({
				_fl_meta_: {
					createdBy: '',
					createdDate: '',
					docId: ref.id,
					env: 'production',
					fl_id: ref.id,
					locale: 'en-US',
					schema: 'subscriptions',
					schemaRef: firestore.collection('fl_schemas').doc('subscriptions'),
					schemaType: 'form',
				},
				id: ref.id
			}))
	}

	return null;

});