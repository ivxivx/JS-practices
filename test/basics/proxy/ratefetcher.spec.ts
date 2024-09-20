import { describe } from "mocha";
import { assert } from "chai";
import { Factory } from "../../../src/basics/proxy/factory";
import { RateFetcherProxy } from "../../../src/basics/proxy/ratefetcher_proxy";

describe("RateFetcherProxy_Test", () => {
   it("without and with proxy", async () => {
      const factory1 = new Factory();
      const rateFetcher11 = await factory1.getRateFetcher('1');
      const rateFetcher12 = await factory1.getRateFetcher('2');

      const rate1 = await rateFetcher11.getExchangeRate('USD', 'USD');
      const rate2 = await rateFetcher12.getExchangeRate('USD', 'USD');

      assert.equal(rate1.toFixed(0), "10");
      assert.equal(rate2.toFixed(0), "20");

      const proxy = new RateFetcherProxy();
      proxy.apply();

      const factory2 = new Factory();
      const rateFetcher21 = await factory2.getRateFetcher('1');
      const rateFetcher22 = await factory2.getRateFetcher('2');

      // output should be 1 after proxy is applied
      const rate3 = await rateFetcher21.getExchangeRate('USD', 'USD');
      // output should be 1 too
      const rate4 = await rateFetcher22.getExchangeRate('USD', 'USD');

      assert.equal(rate3.toFixed(0), "1");
      assert.equal(rate4.toFixed(0), "1");

      // output should be 10
      const rate5 = await rateFetcher21.getExchangeRate('USD', 'EUR');
      // output should be 20
      const rate6 = await rateFetcher22.getExchangeRate('USD', 'EUR');

      console.log(`Rate 5: ${rate5}`);
      console.log(`Rate 6: ${rate6}`);

      assert.equal(rate5.toFixed(0), "10");
      assert.equal(rate6.toFixed(0), "20");
  });
});