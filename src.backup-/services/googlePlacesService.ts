import { SearchResult } from './searchService';

interface GooglePlacesResult {
  place_id: string;
  name: string;
  formatted_address: string;
  types: string[];
  business_status?: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
}

export async function searchGooglePlaces(query: string, location: string): Promise<SearchResult[]> {
  try {
    // Primeiro, fazemos uma busca por texto para encontrar lugares
    const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    searchUrl.searchParams.append('query', `${query} in ${location}`);
    searchUrl.searchParams.append('key', process.env.GOOGLE_PLACES_API_KEY || '');
    searchUrl.searchParams.append('type', 'restaurant'); // Filtra por estabelecimentos
    searchUrl.searchParams.append('language', 'pt-BR');

    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      throw new Error(searchData.error_message || 'Erro ao buscar no Google Places');
    }

    // Mapeia os resultados para nosso formato
    const results: SearchResult[] = await Promise.all(
      searchData.results.map(async (place: GooglePlacesResult) => {
        // Para cada lugar, busca detalhes adicionais
        const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
        detailsUrl.searchParams.append('place_id', place.place_id);
        detailsUrl.searchParams.append('key', process.env.GOOGLE_PLACES_API_KEY || '');
        detailsUrl.searchParams.append('fields', 'name,formatted_address,formatted_phone_number,website,business_status,opening_hours');
        detailsUrl.searchParams.append('language', 'pt-BR');

        const detailsResponse = await fetch(detailsUrl.toString());
        const detailsData = await detailsResponse.json();

        if (!detailsResponse.ok) {
          throw new Error(detailsData.error_message || 'Erro ao buscar detalhes no Google Places');
        }

        const details = detailsData.result;

        // Extrai cidade e estado do endereço formatado
        const addressParts = details.formatted_address.split(',');
        const city = addressParts[addressParts.length - 2]?.trim() || '';
        const state = addressParts[addressParts.length - 1]?.trim() || '';

        return {
          id: place.place_id,
          name: details.name,
          category: place.types[0].replace(/_/g, ' '),
          location: `${city} - ${state}`,
          phone: details.formatted_phone_number,
          website: details.website,
          description: `${details.name} - ${details.formatted_address}`,
          status: details.business_status,
          openDate: details.opening_hours?.weekday_text?.join(', '),
          address: {
            street: addressParts[0]?.trim() || '',
            city,
            state,
            fullAddress: details.formatted_address
          }
        };
      })
    );

    return results;

  } catch (error) {
    console.error('Erro ao buscar no Google Places:', error);
    throw new Error('Não foi possível realizar a busca no Google Places.');
  }
} 