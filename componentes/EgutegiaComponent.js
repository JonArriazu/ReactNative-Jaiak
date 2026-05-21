import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { formatBasqueDateRange } from '../comun/dateUtils';
import {
  COLORS,
  PROVINCE_COLORS,
  PROVINCE_LIGHT_COLORS,
  colorJaiApp,
} from '../comun/comun';

const COLOR_GOGOKOAK = '#8E44AD';

export default function Egutegia({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modo, setModo] = useState('egutegia');

  const favoritosIds = useSelector((state) => state.favoritos.favoritos);
  const jaiak = useSelector((state) => state.jaiak.jaiak);

  const jaiakFiltradas = useMemo(() => {
    if (modo === 'gogokoak') {
      return jaiak.filter((jai) => favoritosIds.includes(jai.id));
    }

    return jaiak;
  }, [jaiak, modo, favoritosIds]);

  const jaiakPorFecha = useMemo(() => {
    const mapa = {};

    jaiakFiltradas.forEach((jai) => {
      const fechaInicio = new Date(jai.startDate);
      const fechaFin = new Date(jai.endDate || jai.startDate);
      const fechaActual = new Date(fechaInicio);

      while (fechaActual <= fechaFin) {
        const fechaTexto = fechaActual.toISOString().split('T')[0];

        if (!mapa[fechaTexto]) {
          mapa[fechaTexto] = [];
        }

        mapa[fechaTexto].push(jai);
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    });

    return mapa;
  }, [jaiakFiltradas]);

  const markedDates = useMemo(() => {
    const marcas = {};

    Object.keys(jaiakPorFecha).forEach((fecha) => {
      if (modo === 'gogokoak') {
        marcas[fecha] = {
          selected: true,
          selectedColor: COLOR_GOGOKOAK,
          selectedTextColor: 'white',
        };
      } else {
        marcas[fecha] = {
          marked: true,
          dotColor: colorJaiApp,
        };
      }
    });

    if (selectedDate) {
      marcas[selectedDate] = {
        ...(marcas[selectedDate] || {}),
        selected: true,
        selectedColor:
          modo === 'gogokoak' ? COLOR_GOGOKOAK : colorJaiApp,
        selectedTextColor: 'white',
      };
    }

    return marcas;
  }, [jaiakPorFecha, selectedDate, modo]);

  const jaiakDelDia = selectedDate ? jaiakPorFecha[selectedDate] || [] : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Egutegia</Text>

        <Text style={styles.subtitulo}>
          Aukeratu egun bat eta ikusi egun horretan dauden jaiak.
        </Text>

        <View style={styles.tabs}>
          <Pressable
            style={[
              styles.tab,
              modo === 'egutegia' && styles.tabActiva,
            ]}
            onPress={() => {
              setModo('egutegia');
              setSelectedDate(null);
            }}
          >
            <Text
              style={[
                styles.tabTexto,
                modo === 'egutegia' && styles.tabTextoActivo,
              ]}
            >
              Egutegia
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              modo === 'gogokoak' && styles.tabActivaGogokoak,
            ]}
            onPress={() => {
              setModo('gogokoak');
              setSelectedDate(null);
            }}
          >
            <Text
              style={[
                styles.tabTexto,
                modo === 'gogokoak' && styles.tabTextoActivo,
              ]}
            >
              Gogokoak
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            todayTextColor:
              modo === 'gogokoak' ? COLOR_GOGOKOAK : colorJaiApp,
            arrowColor:
              modo === 'gogokoak' ? COLOR_GOGOKOAK : colorJaiApp,
            monthTextColor: COLORS.text,
            textMonthFontWeight: 'bold',
            textDayFontWeight: '500',
            selectedDayBackgroundColor:
              modo === 'gogokoak' ? COLOR_GOGOKOAK : colorJaiApp,
          }}
        />
      </View>

      <View style={styles.resultados}>
        {!selectedDate ? (
          <View style={styles.vacio}>
            <MaterialCommunityIcons
              name="calendar-search"
              size={42}
              color={COLORS.muted}
            />
            <Text style={styles.vacioTxt}>
              Sakatu egutegiko egun bat jaiak ikusteko.
            </Text>
          </View>
        ) : jaiakDelDia.length === 0 ? (
          <View style={styles.vacio}>
            <MaterialCommunityIcons
              name={
                modo === 'gogokoak'
                  ? 'heart-off-outline'
                  : 'calendar-remove'
              }
              size={42}
              color={COLORS.muted}
            />
            <Text style={styles.vacioTxt}>
              {modo === 'gogokoak'
                ? 'Egun honetan ez duzu gogoko jairik.'
                : 'Egun honetan ez dago jairik.'}
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.fechaSeleccionada}>
              {selectedDate} · {jaiakDelDia.length} jai
            </Text>

            {jaiakDelDia.map((jai) => {
              const provColor =
                PROVINCE_COLORS[jai.province] || COLORS.primary;
              const cardColor =
                PROVINCE_LIGHT_COLORS[jai.province] || COLORS.card;

              return (
                <Pressable
                  key={jai.id}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: cardColor,
                      borderLeftColor:
                        modo === 'gogokoak' ? COLOR_GOGOKOAK : provColor,
                    },
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => navigation.navigate('DetalleJai', { jai })}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.nombre}>{jai.name}</Text>

                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor:
                            modo === 'gogokoak'
                              ? COLOR_GOGOKOAK
                              : provColor,
                        },
                      ]}
                    >
                      <Text style={styles.badgeTxt}>{jai.province}</Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.fecha,
                      {
                        color:
                          modo === 'gogokoak'
                            ? COLOR_GOGOKOAK
                            : provColor,
                      },
                    ]}
                  >
                    {formatBasqueDateRange(jai.startDate, jai.endDate)}
                  </Text>

                  <Text style={styles.lugar}>
                    {jai.area} · {jai.city}
                  </Text>
                </Pressable>
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 14,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitulo: {
    fontSize: 15,
    color: COLORS.muted,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 999,
    padding: 4,
    marginTop: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  tabActiva: {
    backgroundColor: colorJaiApp,
  },
  tabActivaGogokoak: {
    backgroundColor: COLOR_GOGOKOAK,
  },
  tabTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.muted,
  },
  tabTextoActivo: {
    color: 'white',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  resultados: {
    marginTop: 20,
  },
  fechaSeleccionada: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 8,
  },
  cardPressed: {
    opacity: 0.75,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  nombre: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeTxt: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fecha: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
  },
  lugar: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.text,
  },
  vacio: {
    alignItems: 'center',
    marginTop: 35,
    gap: 10,
  },
  vacioTxt: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: 'center',
  },
});