// src/notifications/notifications.js
/**
 * Listeners-only setup (no save, no consume):
 * - Permissions + Android channel
 * - Foreground FCM -> Notifee local display (images/actions)
 * - Taps (FG/BG/quit) -> NO-OP (sirf logs)
 * - Optional: unread badge refresh via Redux action
 */

import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';

import { getValueIntoAsyncStorage, _setDataToAsyncStorage } from '../asyncStorage/Functions';
import { FCM_TOKEN } from '../asyncStorage/Constants';
import { store } from '../../store';
import { getUnreadNotificationCount } from '../../store/actions/Auth.action';
import {preserveNotification} from "../../store/actions/Global.action";

// ---------- iOS action category (for local buttons) ----------
const IOS_CATEGORY_ID = 'dynamic-actions';
async function ensureIosCategory(actions) {
    if (Platform.OS !== 'ios') return;
    if (!Array.isArray(actions) || actions.length === 0) return;
    await notifee.setNotificationCategories([
        {
            id: IOS_CATEGORY_ID,
            actions: actions.map((a) => ({
                id: a.id,
                title: a.title,
                input: a.input ? { buttonTitle: 'Send', placeholder: 'Type here' } : undefined,
                foreground: true,
                destructive: !!a.destructive,
            })),
        },
    ]);
}

// ---------- Permissions ----------
export const requestUserPermission = async () => {
    await ensureChannel();
    await notifee.requestPermission({ alert: true, sound: true, badge: true }).catch(() => {});
    // (Optional) Firebase permission prompt (iOS)
    await messaging().requestPermission().catch(() => {});
    if (Platform.OS === 'android') {
        try {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        } catch {}
    }
};

// ---------- Android Channel (cached) ----------
const CHANNEL = { id: 'naqad-channel', created: false };
async function ensureChannel() {
    if (CHANNEL.created) return CHANNEL.id;
    try {
        await notifee.createChannel({
            id: CHANNEL.id,
            name: 'Naqad',
            description: 'Naqad notifications',
            importance: AndroidImportance.HIGH,
            vibration: true,
            sound: 'default',
        });
        CHANNEL.created = true;
    } catch {}
    return CHANNEL.id;
}

// ---------- FCM token (local storage for token only; NOT saving notification payloads) ----------
export const getFcmTokenFromLocalStorage = async () => {
    const existing = await getValueIntoAsyncStorage(FCM_TOKEN).catch(() => null);
    if (!existing) {
        try {
            const token = await messaging().getToken();
            await _setDataToAsyncStorage(FCM_TOKEN, token);
            // TODO: send token to backend
        } catch (e) {
            console.error('getToken error', e);
        }
    }
    messaging().onTokenRefresh(async (token) => {
        try {
            await _setDataToAsyncStorage(FCM_TOKEN, token);
            // TODO: send refreshed token to backend
        } catch {}
    });
};

// ---------- Helpers ----------
function buildActionsFromData(data = {}) {
    const actions = [];
    for (let i = 1; i <= 4; i++) {
        const id = data[`action${i}Id`];
        if (!id) continue;
        actions.push({
            id,
            title: data[`action${i}Title`] || 'Open',
            input: String(data[`action${i}Input`]) === 'true',
            destructive: String(data[`action${i}Destructive`]) === 'true',
            foreground: true,
        });
    }
    return actions;
}

function asImageResource(val) {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return undefined;
    const s = val.trim();
    if (!s) return undefined;
    if (s.startsWith('https://') || s.startsWith('http://')) return s;
    if (/^[a-z0-9_]+$/i.test(s)) return s; // drawable name
    return undefined;
}

function safeParseJsonMaybe(str) {
    if (typeof str !== 'string') return undefined;
    try { return JSON.parse(str); } catch { return undefined; }
}


function isValidHttp(s) {
    return typeof s === 'string' && /^https?:\/\//i.test(s);
}

// ---------- Local display (images + actions), NO saving ----------
/**
 * cfg: { id?, title, body, imageUrl?, largeIconUrl?, data?, actions?[], sound?, ongoing? }
 */
export async function showDynamicNotification(cfg = {}) {
    const channelId = await ensureChannel();
    if (cfg.actions?.length) await ensureIosCategory(cfg.actions);

    const safeId =
        typeof cfg.id === 'string' && cfg.id.trim()
            ? cfg.id
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const mergedData = { ...(cfg.data || {}) };
    const parsedParam = safeParseJsonMaybe(cfg.param);
    if (parsedParam) mergedData.param = parsedParam;

    const largeIcon = asImageResource(cfg.largeIconUrl);
    // const picture = asImageResource(cfg.imageUrl);

    const fcmOpts = typeof cfg?.data?.fcm_options === 'string' ? safeParseJsonMaybe(cfg.data.fcm_options) : cfg?.data?.fcm_options;

    // helper: pick first valid http(s) url
    const pickUrl = (...cands) => {
        for (const c of cands) {
            const s = typeof c === 'string' ? c.trim() : c;
            if (isValidHttp(s)) return s;
        }
        return undefined;
    };

    // choose picture from multiple sources
    const picture = pickUrl(
        cfg?.imageUrl,
        cfg?.image,                       // just in case you pass it like this
        cfg?.data?.imageUrl,
        cfg?.data?.image,
        fcmOpts?.image,                   // <-- your Mario URL lands here
        cfg?.notification?.imageUrl,
        cfg?.notification?.android?.imageUrl,
        cfg?.notification?.ios?.imageUrl
    );

    // const picture = cfg.imageUrl && typeof cfg.imageUrl === 'string' ? cfg.imageUrl.trim() : undefined;
    // const picture = cfg.imageUrl || undefined;
    console.log('picture', picture, fcmOpts, cfg)
    const iosCategory =
        Platform.OS === 'ios' && Array.isArray(cfg.actions) && cfg.actions.length > 0
            ? IOS_CATEGORY_ID
            : null;

    // iOS: attachments array (remote URLs need NSE)
    const iosAttachments = isValidHttp(picture) ? [{ url: picture }] : undefined;

    console.log('iosAttachments', iosAttachments);

    await notifee.displayNotification({
        id: safeId,
        title: cfg.title || 'Naqad',
        body: cfg.body || '',
        data: mergedData,
        android: {
            channelId,
            // smallIcon: 'ic_stat_notification',
            ongoing: !!cfg.ongoing,
            pressAction: { id: 'open' }, // tap opens app; we do NOTHING else
            actions: (cfg.actions || []).map((a) => ({
                title: a.title,
                pressAction: { id: a.id, launchActivity: 'default' },
                input: a.input ? { allowFreeFormInput: true, placeholder: 'Type here' } : undefined,
                destructive: !!a.destructive,
            })),
            ...(picture
                ? { style: { type: AndroidStyle.BIGPICTURE, picture } }
                : {}),
            ...(largeIcon ? { largeIcon } : {}),
        },
        ios: {
            ...(iosCategory ? { categoryId: iosCategory } : {}),
            sound: cfg.sound !== false ? 'default' : undefined,
            foregroundPresentationOptions: { alert: true, badge: true, sound: true, banner: true, list: true },
            ...(iosAttachments ? { attachments: iosAttachments } : {}),
        },
    });
}

// ---------- Listeners (FG + BG + initial + Notifee initial), NO saving ----------
/**
 * Mount and forget — no save, no consume, no navigation.
 */
export const notificationListener = () => {
    // Foreground FCM -> local Notifee
    const unsubOnMessage = messaging().onMessage(async (remoteMessage) => {
        console.log('[FCM] onMessage', remoteMessage?.messageId);
        try { store.dispatch(getUnreadNotificationCount()); } catch {}

        const n = remoteMessage?.notification;
        const d = remoteMessage?.data || {};
        const imageFromNotif = n?.android?.imageUrl || n?.imageUrl;
        const imageFromData  = d?.imageUrl;
        const actions = buildActionsFromData(d);

        try {
            await showDynamicNotification({
                title: d.title || n?.title || 'Naqad',
                body:  d.body  || n?.body  || '',
                imageUrl: imageFromData || imageFromNotif || null,
                largeIconUrl: d.largeIconUrl || null,
                sound: String(d.sound) !== 'false',
                data: d,
                actions,
            });
        } catch (e) {
            console.error('displayNotification failed:', e);
        }
    });

    // Notifee foreground tap -> NO-OP // jub app open ho or user notification pay tap karay
    const unsubNotifeeFg = notifee.onForegroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
            console.log('[NOTIFEE] Foreground tap (no-op). Data:', detail?.notification);
            // intentionally doing nothing
            store.dispatch(preserveNotification(detail?.notification));
        }
    });

    // Background (FCM tray) -> NO-OP (just log) // jub app open ho or background may user notification pay tap karay
    const unsubOpened = messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log('[FCM] onNotificationOpenedApp (no-op). Data:', remoteMessage);
        store.dispatch(preserveNotification(remoteMessage));

    });

    // Killed (FCM cold start) -> NO-OP (just log) // jub app killed ho or tap karkay open karay user
    messaging().getInitialNotification().then(async (rm) => {
        if (rm) console.log('[FCM] getInitialNotification (no-op). Data:', rm, rm?.data);
        store.dispatch(preserveNotification(rm));
    }).catch(() => {});

    // Killed (Notifee local initial) -> NO-OP (just log)
    notifee.getInitialNotification().then(async (initial) => {
        if (initial) {
            console.log('[NOTIFEE] getInitialNotification (no-op). Data:', initial?.notification?.data);
        }
    }).catch(() => {});

    return () => {
        try { unsubOnMessage?.(); } catch {}
        try { unsubOpened?.(); } catch {}
        try { unsubNotifeeFg?.(); } catch {}
    };
};

// ---------- Simple wrapper (optional) ----------
export function showNotification(image, title, message, id, vibrate, sound, ongoing = false) {
    return showDynamicNotification({
        id: typeof id === 'string' ? id : id ? String(id) : undefined,
        title,
        body: message,
        imageUrl: image,
        sound: !!sound,
        ongoing: !!ongoing,
        actions: [],
        data: {},
    });
}
