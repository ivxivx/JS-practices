import { describe } from "mocha";
import { expect } from "chai";
import { Wait } from "testcontainers";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Pool } from "pg";

describe("TestContainer_PostgreSQL_Test", () => {
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
  });

  after(async function() {
    if (pool) {
      await pool.end();
    }

    if (container) {
      await container.stop();
    }
  });

  it("should connect and return a query result", async () => {
    const client = await pool.connect()

    try {
      const result = await client.query("SELECT 1");

      expect(result.rows[0]).to.deep.equal({ "?column?": 1 });  
    } finally {
      client.release();
    }
  });
})