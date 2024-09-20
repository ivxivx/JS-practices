import { BaseRateFetcher } from "./ratefetcher_base";
import { RateFetcher1 } from "./ratefecther1";
import { RateFetcher2 } from "./ratefecther2";

export class Factory {
  public async getRateFetcher(providerId: string): Promise<BaseRateFetcher> {
    switch (providerId) {
      case '1':
        return new RateFetcher1();
      case '2':
        return new RateFetcher2();
      default:
        throw new Error(`Provider with id ${providerId} is not supported`);
    }
  }
}