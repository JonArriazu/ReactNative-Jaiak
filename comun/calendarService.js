import * as Calendar from 'expo-calendar';

export async function addJaiToCalendar(jai) {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status !== 'granted') {
        throw new Error('Ez duzu egutegirako baimena eman.');
    }

    const defaultCalendar = await Calendar.getDefaultCalendarAsync();

    if (!defaultCalendar) {
        throw new Error('Ez da egutegirik aurkitu mugikorrean.');
    }

    const startDate = new Date(`${jai.startDate}T10:00:00`);
    const endDate = new Date(`${jai.endDate || jai.startDate}T23:59:00`);

    await Calendar.createEventAsync(defaultCalendar.id, {
        title: jai.name,
        startDate: startDate,
        endDate: endDate,
        timeZone: 'Europe/Madrid',
        location: `${jai.area || ''} ${jai.city || ''}`,
        notes: jai.description || 'JaiApp aplikaziotik gehitutako jaia.',
    });
}