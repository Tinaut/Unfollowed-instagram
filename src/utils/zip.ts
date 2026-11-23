import JSZip from 'jszip';

export type DatosExportacion = {
  seguidores: any[]; // puede haber varios: followers_1.json, followers_2.json...
  seguidos: any | null;
  archivosEncontrados: string[];
};

export async function leerExportacionZip(uri: string): Promise<DatosExportacion> {
  const respuesta = await fetch(uri);
  const buffer = await respuesta.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);

  const resultado: DatosExportacion = { seguidores: [], seguidos: null, archivosEncontrados: [] };

  for (const [ruta, entrada] of Object.entries(zip.files)) {
    if (entrada.dir) continue;
    const esSeguidores = /(^|\/)followers_\d+\.json$/i.test(ruta);
    const esSeguidos = /(^|\/)following\.json$/i.test(ruta);
    if (!esSeguidores && !esSeguidos) continue;

    const json = JSON.parse(await entrada.async('string'));
    resultado.archivosEncontrados.push(ruta);
    if (esSeguidores) resultado.seguidores.push(json);
    else resultado.seguidos = json;
  }
  return resultado;
}