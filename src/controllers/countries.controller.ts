import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CountriesService } from '../services/countries.service';


@Controller('countries')

export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get(':periscope_domain_key/:user_email')
  async getCountriesByDomainAndUser(
    @Param('periscope_domain_key') periscopeDomainKey: string,
    @Param('user_email') userEmail: string,
  ) {
    return this.countriesService.getCountriesByDomainAndUser(
      periscopeDomainKey,
      userEmail,
    );
  }
}
