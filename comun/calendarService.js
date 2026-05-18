import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

async function getCalendarId() {
    if (Platform.OS === 'ios') {
        const cal = await Calendar.getDefaultCalendarAsync();
        return cal.id;
    }

    // Android: getDefaultCalendarAsync no existe, buscamos el calendario nativo del dispositivo
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const editable = calendars.filter(c => c.allowsModifications && c.source?.type !== 'com.google');

    // Prioridad 1: calendario nativo del fabricante (Samsung, Huawei, AOSP...)
    const native = editable.find(c => c.source?.type !== 'LOCAL');
    if (native) return native.id;

    // Prioridad 2: cualquier editable no-Google
    if (editable.length > 0) return editable[0].id;

    // Si no hay ninguno editable, creamos uno nuevo
    const newId = await Calendar.createCalendarAsync({
        title: 'JaiApp',
        color: '#009B48',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: calendars[0]?.source?.id,
        source: calendars[0]?.source ?? { isLocalAccount: true, name: 'JaiApp', type: 'LOCAL' },
        name: 'JaiApp',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    return newId;
}

export async function addJaiToCalendar(jai) {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status !== 'granted') {
        throw new Error('Ez duzu egutegirako baimena eman.');
    }

    const calendarId = await getCalendarId();

    const startDate = new Date(`${jai.startDate}T10:00:00`);
    const endDate   = new Date(`${jai.endDate || jai.startDate}T23:59:00`);

    await Calendar.createEventAsync(calendarId, {
        title: jai.name,
        startDate,
        endDate,
        timeZone: 'Europe/Madrid',
        location: `${jai.area || ''} ${jai.city || ''}`.trim(),
        notes: jai.description || 'JaiApp aplikaziotik gehitutako jaia.',
    });
}
