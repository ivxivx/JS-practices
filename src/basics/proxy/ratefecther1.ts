import { Decimal } from 'decimal.js';
import { BaseRateFetcher } from './ratefetcher_base';

export class RateFetcher1 extends BaseRateFetcher {
  // fetch rates from provider1
  public async getExchangeRate(buyCurrency: string, sellCurrency: string): Promise<Decimal> {
    return new Decimal(10);
  }
}