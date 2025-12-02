// Utilitários de geolocalização - Fórmula de Haversine

import type { Localizacao } from "@/types/firestore"

/**
 * Calcula a distância entre duas coordenadas usando a fórmula de Haversine
 * @param loc1 Primeira localização
 * @param loc2 Segunda localização
 * @returns Distância em quilômetros
 */
export function calcularDistancia(loc1: Localizacao, loc2: Localizacao): number {
  const R = 6371 // Raio da Terra em km
  const dLat = grausParaRadianos(loc2.lat - loc1.lat)
  const dLng = grausParaRadianos(loc2.lng - loc1.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(grausParaRadianos(loc1.lat)) *
      Math.cos(grausParaRadianos(loc2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distancia = R * c

  return distancia
}

function grausParaRadianos(graus: number): number {
  return graus * (Math.PI / 180)
}

/**
 * Obtém a localização atual do usuário via navegador
 */
export function obterLocalizacaoAtual(): Promise<Localizacao> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não é suportada pelo navegador"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
    )
  })
}

/**
 * Ordena serviços por distância em relação a uma localização
 */
export function ordenarPorDistancia<T extends { location: Localizacao }>(
  items: T[],
  localizacaoUsuario: Localizacao,
): (T & { distancia: number })[] {
  return items
    .map((item) => ({
      ...item,
      distancia: calcularDistancia(localizacaoUsuario, item.location),
    }))
    .sort((a, b) => a.distancia - b.distancia)
}
