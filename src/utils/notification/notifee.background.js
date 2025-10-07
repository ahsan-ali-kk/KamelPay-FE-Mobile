import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidStyle, EventType } from '@notifee/react-native';
import { showDynamicNotification } from './notifications';

messaging().setBackgroundMessageHandler(async (rm) => {

    if (rm?.notification) {
        return; // let the system display it
    }

    const d = rm?.data || {};
    const fcmOpts = typeof d?.fcm_options === 'string' ? JSON.parse(d.fcm_options || '{}') : d?.fcm_options;
    const image = d.imageUrl || d.image || fcmOpts?.image || rm?.notification?.android?.imageUrl || rm?.notification?.imageUrl;

    // ensure channel at least once
    try { await notifee.createChannel({ id: 'naqad-channel', name: 'Naqad' }); } catch {}

    await showDynamicNotification({
        title: d.title || rm?.notification?.title || 'Naqad',
        body:  d.body  || rm?.notification?.body  || '',
        imageUrl: image,
        data: d,
    });
});

// Optional: taps when app killed/background:
notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
        // handle tap if you want
    }
});
