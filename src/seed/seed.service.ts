import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonResponse } from './interfaces/pokemon-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokemonSeed } from './interfaces/pokemon-seed.interface';

@Injectable()
export class SeedService {

    private readonly axios: AxiosInstance = axios;

    constructor(
        private readonly pokemonService: PokemonService
    ) { }

    async executeSeed() {
        await this.pokemonService.removeSeed()

        const { data } = await this.axios.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=700');
        const pokemonToInsert: PokemonSeed[] = [];

        data.results.forEach(({ name, url }) => {
            const segments = url.split('/')
            const no: number = +segments[segments.length - 2]
            pokemonToInsert.push({ name, no })
        });

        await this.pokemonService.createSeed(pokemonToInsert)

        return 'Seed executed';
    }

}
