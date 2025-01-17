import { Injectable } from '@nestjs/common';
import { PokemonResponse } from './interfaces/pokemon-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokemonSeed } from './interfaces/pokemon-seed.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
    constructor(
        private readonly pokemonService: PokemonService,
        private readonly http: AxiosAdapter
    ) { }

    async executeSeed() {
        // Elimina todos los pokemons de la db
        await this.pokemonService.removeSeed()

        const data = await this.http.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=700');
        const pokemonToInsert: PokemonSeed[] = [];

        data.results.forEach(({ name, url }) => {
            const segments = url.split('/')
            const no: number = +segments[segments.length - 2]
            pokemonToInsert.push({ name, no })
        });

        // Inserta todos los pokemons a la db
        await this.pokemonService.createSeed(pokemonToInsert)

        return 'Seed executed';
    }

}
