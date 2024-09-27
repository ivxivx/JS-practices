

# Pre-requisite
## Testcontainer
Configure container runtime if not using Docker.
https://node.testcontainers.org/supported-container-runtimes/

To enable logging, execute the following in terminal:
``.


# Test
To run all tests, use `npm run test`.
To run single test, use `npx mocha test/database/lock.spec.ts`.

To run test with Testcontainer logging enabled, use `DEBUG=testcontainers* npx mocha test/database/lock.spec.ts`.


# Code Snippet
## Database
### Lock
src/database/lock.ts

## Test
### Test Containers
How to use testcontainers for unit test.

test/testcontainer

