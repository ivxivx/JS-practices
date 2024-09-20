import { Decimal } from 'decimal.js';

export abstract class BaseRateFetcher {
  public abstract getExchangeRate(buyCurrency: string, sellCurrency: string): Promise<Decimal>;
}