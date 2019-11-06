import { functions, firestore } from './firebase';

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
