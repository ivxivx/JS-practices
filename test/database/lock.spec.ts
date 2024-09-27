import { describe } from "mocha";
import { expect } from "chai";
import { Wait } from "testcontainers";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Pool } from "pg";
import fs from "fs";
import {LockService} from "../../src/database/lock";

describe("Lock_Test", () => {
  let container: StartedPostgreSqlContainer;
  let pool: Pool;

  before(async function() {
    container = await new PostgreSqlContainer()
    .withWaitStrategy(Wait.forAll([
      Wait.forListeningPorts(),
      Wait.forLogMessage(/[r|R]eady to accept connections/)
    ]))
    .start();
  
    const connectionString = container.getConnectionUri();

    pool = new Pool({
      connectionString,
    })

    const ddl = fs.readFileSync('src/database/lock.sql').toString()

    await pool.query(ddl);
  });

  after(async function() {
    if (pool) {
      await pool.end();
    }

    if (container) {
      await container.stop();
    }
  });
  
  beforeEach(async function() {
  });

  afterEach(function() {
  });

  it("given no existing lock, should return acquired as true", async () => {
    const lockService = new LockService(pool);

    const req = {
      resource: 'resource1',
      owner: 'owner1'
    }

    const res = await lockService.tryLock(req, () => {
      return Promise.resolve('callback done');
    })

    expect(res.lockAcquired).to.equal(true);

    if (res.lockAcquired) {
      expect(res.data).to.equal('callback done');
    }

    const lock = await lockService.findByResource(req.resource);

    // auto locked (deleted)
    expect(lock).to.be.undefined;
  });

  it("given reentrant lock, should return acquired as true", async () => {
    const lockService = new LockService(pool);

    const req = {
      resource: 'resource2',
      owner: 'owner2'
    }

    const res1 = await lockService.tryLock(req, async () => {
      const res2 = await lockService.tryLock(req, () => {
        return Promise.resolve('callback2 done');
      })
  
      expect(res2.lockAcquired).to.equal(true);
  
      if (res2.lockAcquired) {
        expect(res2.data).to.equal('callback2 done');
      }
  
      const lock2 = await lockService.findByResource(req.resource);
  
      // lock still exists because this is reentrant lock
      expect(lock2.resource).to.equal(req.resource);
      expect(lock2.owner).to.equal(req.owner);

      return Promise.resolve('callback1 done');
    })

    expect(res1.lockAcquired).to.equal(true);

    if (res1.lockAcquired) {
      expect(res1.data).to.equal('callback1 done');
    }

    const lock1 = await lockService.findByResource(req.resource);

    // auto locked (deleted)
    expect(lock1).to.be.undefined;
  });

  it("given lock exists for different user, should return acquired as false", async () => {
    const lockService = new LockService(pool);

    const req1 = {
      resource: 'resource3',
      owner: 'owner31'
    }

    const req2 = {
      resource: 'resource3',
      owner: 'owner32'
    }

    const res1 = await lockService.tryLock(req1, async () => {
      const res2 = await lockService.tryLock(req2, () => {
        return Promise.resolve('callback2 done');
      })
  
      expect(res2.lockAcquired).to.equal(false);
  
      const lock2 = await lockService.findByResource(req2.resource);
  
      // lock exists for owner 1
      expect(lock2.resource).to.equal(req2.resource);
      expect(lock2.owner).to.equal(req1.owner);

      return Promise.resolve('callback1 done');
    })

    expect(res1.lockAcquired).to.equal(true);

    if (res1.lockAcquired) {
      expect(res1.data).to.equal('callback1 done');
    }

    const lock1 = await lockService.findByResource(req1.resource);

    // auto locked (deleted)
    expect(lock1).to.be.undefined;
  });
})