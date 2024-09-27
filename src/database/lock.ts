
import { Pool } from 'pg';
import { addMilliseconds } from 'date-fns';

export type LockOption = {
  autoUnlock: boolean; // default true
  reentrant: boolean; // default true
};

export type CreateLockReqVo = {
  resource: string;
  owner: string;
  expiresAt?: Date;
};

export type CreateLockResVo<T> =
  | {
      lockAcquired: true;
      data: T;
    }
  | {
      lockAcquired: false;
      error: unknown;
    };

export class LockService {
  static readonly DEFAULT_EXPIRY_PERIOD = 600_000; // 10 minutes

  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findByResource(resource: string) {
    const result = await this.pool.query('SELECT * FROM locks WHERE resource = $1', [resource]);
    
    return result?.rows?.length > 0 ? result.rows[0] : undefined;
  }

  async deleteExpired() {
    return await this.pool.query('DELETE FROM locks WHERE expires_at <= $1', [new Date()]);
  }

  async lock<T>(req: CreateLockReqVo, callback: () => Promise<T>, option?: LockOption): Promise<T> {
    const { resource } = req;
    return this.tryLock(req, callback, option).then((res) => {
      if (res.lockAcquired === true) {
        return res.data;
      } else {
        throw new Error(`Could not acquire lock for resource: ${resource}`);
      }
    });
  }

  async tryLock<T>(req: CreateLockReqVo, callback: () => Promise<T>, option?: LockOption): Promise<CreateLockResVo<T>> {
    const { resource, owner } = req;
    const expiresAt = req.expiresAt || addMilliseconds(new Date(), LockService.DEFAULT_EXPIRY_PERIOD);
    const data = {
      resource,
      owner,
      expires_at: expiresAt,
    };

    let lockModel;
    let reentrant = false;

    try {
      const insertQuery = 'INSERT INTO locks (resource, owner, expires_at) VALUES ($1, $2, $3) RETURNING *';
      const insertValues = [data.resource, data.owner, data.expires_at];
      
      const result = await this.pool.query(insertQuery, insertValues);
      lockModel = result?.rows[0];

      const res = await callback();
      return{
        lockAcquired: true,
        data: res,
      };
    } catch (err: unknown) {
      const isUniqueConstraintViolated = (err as any).code === '23505'; // Postgres unique constraint violation code
      if (!isUniqueConstraintViolated) {
        throw err;
      }

      const selectQuery = 'SELECT * FROM locks WHERE resource = $1';
      const existingLockModelResult = await this.pool.query(selectQuery, [resource]);
      const existingLockModel = existingLockModelResult?.rows[0];

      // reentrant
      if (existingLockModel?.owner === req.owner) {
        if (option?.reentrant === undefined || option.reentrant) {
          reentrant = true;

          const res = await callback();
          return{
            lockAcquired: true,
            data: res,
          };
        }
      }

      return {
        lockAcquired: false,
        error: err,
      };
    } finally {
      if (lockModel) {
        if (!reentrant && (option?.autoUnlock === undefined || option?.autoUnlock)) {
          // only delete if the lock is still owned by the same owner
          const deleteQuery = 'DELETE FROM locks WHERE resource = $1 AND owner = $2';
          await this.pool.query(deleteQuery, [resource, req.owner]);
        }
      }
    }
  }
}