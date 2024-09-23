

## Basics
### Proxy
#### Purpose
This demonstrates how to use Proxy (and Prototype) to intercept calls to an abstract method.

#### Context
- ratefetcher_base.ts: the base class `BaseRateFetcher` which declares an abstract method 
```
getExchangeRate(buyCurrency: string, sellCurrency: string): Promise<Decimal>
```
- ratefecther1.ts and ratefecther2.ts: two implementation classes ('RateFetcher1' and 'RateFetcher2') which simulate retrieval of exchange rate based on input parameters `buyCurrency` and `sellCurrency` from two providers
- factory.ts: the factory class which returns `RateFetcher1` or `RateFetcher2` according to the input parameter `providerId`
- ratefetcher_proxy.ts: the proxy class which intercept the calls to `getExchangeRate`

#### Problem
When the input parameters `buyCurrency` and `sellCurrency` are the same, the rate fetchers do not need to call provider to get the exchange rate, instead, they can directly return 1.

Because `getExchangeRate` is an abstract method, it does not work to intercept it directly with its Prototype.

#### Solution
To achieve the goal
1. The Proxy is created which uses a handler to intercept the original `getExchangeRate` method. 
2. Then, the factory's Prototype is used to create the Proxy, so the handler method will be called instead of the original `getRateFetcher` method.
