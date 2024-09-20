import { Decimal } from 'decimal.js';
import { Factory } from './factory';
import { BaseRateFetcher } from './ratefetcher_base';

export class RateFetcherProxy {
  public async apply() {

    const originalGetRateFetcher = Factory.prototype.getRateFetcher;

    const handler = {
      get(target: any, prop: string, receiver: any) {
        if (prop === 'getExchangeRate') {
          return async function (...args: any[]) {
            console.log(`Intercepted calls to getExchangeRate with arguments: ${args}`);

            if (args[0] === args[1]) {
              console.log(`Result from getExchangeRate for same currency: 1`);
              
              return new Decimal(1);
            }
            
            const result = await target[prop].apply(target, args);
            
            console.log(`Result from getExchangeRate for different currencies: ${result}`);
            
            return result;
          };
        }

        return Reflect.get(target, prop, receiver);
      }
    };

    Factory.prototype.getRateFetcher = async function (providerId: string): Promise<BaseRateFetcher> {
      console.log(`Intercepted call to getRateFetcher with arguments: ${providerId}`);

      // Call the original method
      const originalModule = await originalGetRateFetcher.apply(this, [providerId]);
      
      return new Proxy(originalModule, handler);
    }
  }
}
