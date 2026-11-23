import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Linking,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { noTeSiguen } from '../utils/compare';
import { leerExportacionZip } from '../utils/zip';

type Estado = { texto: string; error: boolean };

export default function Index() {
  const [archivo, setArchivo] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [resultado, setResultado] = useState<string[] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [estado, setEstado] = useState<Estado>({
    texto: 'Elige el ZIP que descargaste de Instagram.',
    error: false,
  });

  const elegirZip = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (res.canceled) return;
      const elegido = res.assets[0];
      if (!elegido.name.toLowerCase().endsWith('.zip')) {
        setArchivo(null);
        setEstado({ texto: 'Ese archivo no es un .zip.', error: true });
        return;
      }
      setArchivo(elegido);
      setResultado(null);
      setEstado({ texto: `Archivo elegido: ${elegido.name}`, error: false });
    } catch (e: any) {
      setEstado({ texto: 'Error al elegir: ' + (e?.message ?? String(e)), error: true });
    }
  };

  const comparar = async () => {
    if (!archivo) return;
    try {
      setCargando(true);
      setEstado({ texto: 'Leyendo el ZIP...', error: false });
      const datos = await leerExportacionZip(archivo.uri);

      if (!datos.seguidos) {
        setResultado(null);
        setEstado({ texto: 'No encontré following.json dentro del ZIP.', error: true });
      } else if (datos.seguidores.length === 0) {
        setResultado(null);
        setEstado({
          texto: 'No encontré followers_N.json en el ZIP, así que no puedo comparar.',
          error: true,
        });
      } else {
        setResultado(noTeSiguen(datos.seguidores, datos.seguidos));
        setEstado({ texto: 'Comparación lista.', error: false });
      }
    } catch (e: any) {
      setResultado(null);
      setEstado({ texto: 'Error al comparar: ' + (e?.message ?? String(e)), error: true });
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.pantalla}>
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>¿Quién no me sigue?</Text>
        <Text style={styles.subtitulo}>
          Descubre a quién sigues en Instagram que no te sigue de vuelta.
        </Text>
      </View>

      <View style={styles.botones}>
        <Pressable
          style={({ pressed }) => [styles.boton, styles.botonSecundario, pressed && styles.pulsado]}
          onPress={elegirZip}
          disabled={cargando}>
          <Text style={styles.textoSecundario}>1. Elegir ZIP</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            styles.botonPrincipal,
            (!archivo || cargando) && styles.desactivado,
            pressed && styles.pulsado,
          ]}
          onPress={comparar}
          disabled={!archivo || cargando}>
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoPrincipal}>2. Comparar</Text>
          )}
        </Pressable>
      </View>

      <Text style={[styles.estado, estado.error && styles.estadoError]}>{estado.texto}</Text>

      {resultado && (
        <View style={styles.resumen}>
          <Text style={styles.numero}>{resultado.length}</Text>
          <Text style={styles.resumenTexto}>
            {resultado.length === 1 ? 'cuenta no te sigue de vuelta' : 'cuentas no te siguen de vuelta'}
          </Text>
        </View>
      )}

      <FlatList
        data={resultado ?? []}
        keyExtractor={(u) => u}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.tarjeta, pressed && styles.pulsado]}
            onPress={() => Linking.openURL(`https://instagram.com/${item}`)}>
            <View style={styles.avatar}>
              <Text style={styles.inicial}>{item.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.usuario} numberOfLines={1}>
              @{item}
            </Text>
            <Text style={styles.flecha}>›</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const ACENTO = '#E1306C';

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#FAFAFA', paddingHorizontal: 20, paddingTop: 64 },
  cabecera: { marginBottom: 20 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  subtitulo: { fontSize: 15, color: '#666', marginTop: 6, lineHeight: 21 },

  botones: { flexDirection: 'row', gap: 12 },
  boton: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  botonPrincipal: { backgroundColor: ACENTO },
  botonSecundario: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: ACENTO },
  textoPrincipal: { color: '#fff', fontWeight: '700', fontSize: 16 },
  textoSecundario: { color: ACENTO, fontWeight: '700', fontSize: 16 },
  desactivado: { opacity: 0.4 },
  pulsado: { opacity: 0.7 },

  estado: { marginTop: 14, fontSize: 14, color: '#555' },
  estadoError: { color: '#C62828' },

  resumen: {
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  numero: { fontSize: 44, fontWeight: '800', color: ACENTO },
  resumenTexto: { fontSize: 15, color: '#555', marginTop: 2 },

  lista: { paddingTop: 16, paddingBottom: 40, gap: 10 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDE4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: { color: ACENTO, fontWeight: '800', fontSize: 16 },
  usuario: { flex: 1, marginLeft: 12, fontSize: 16, color: '#1A1A1A', fontWeight: '500' },
  flecha: { fontSize: 24, color: '#BBB' },
});