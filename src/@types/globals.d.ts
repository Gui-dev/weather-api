/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/naming-convention */

declare module globalThis {
  // eslint-disable-next-line no-var
  var testRequest: import('supertest').SuperTest<import('supertest').Test>
}
