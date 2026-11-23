function usuarioDeItem(item: any): string | undefined {
  const datos = item?.string_list_data?.[0];
  const href: string | undefined = datos?.href;
  if (href) {
    const ultimo = href.split('?')[0].split('/').filter(Boolean).pop();
    if (ultimo) return ultimo.toLowerCase();
  }
  const nombre: string | undefined = datos?.value ?? item?.title;
  return nombre ? nombre.toLowerCase() : undefined;
}

function esCuentaEliminada(usuario: string): boolean {
  return usuario.startsWith('__deleted__') || usuario.includes('cuenta___eliminada');
}

function extraerUsuarios(json: any): string[] {
  const lista = Array.isArray(json) ? json : json?.relationships_following ?? [];
  const usuarios: string[] = [];
  for (const item of lista) {
    const u = usuarioDeItem(item);
    if (u && !esCuentaEliminada(u)) usuarios.push(u);
  }
  return usuarios;
}

export function noTeSiguen(seguidoresJsons: any[], seguidosJson: any): string[] {
  const seguidores = new Set<string>();
  for (const json of seguidoresJsons) {
    for (const u of extraerUsuarios(json)) seguidores.add(u);
  }
  return extraerUsuarios(seguidosJson).filter((u) => !seguidores.has(u));
}