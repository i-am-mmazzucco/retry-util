import { RetryUtil } from './RetryUtil';

describe('RetryService', () => {
  describe('retry()', () => {
    describe('on success', () => {
      it('Should pass on valid promise', async () => {
        const instance = new RetryUtil({
          errorMessage: 'error message'
        });
        const jestFn = jest
          .fn()
          .mockImplementation(async () => Promise.resolve('works'));
        const response = await instance.retry(jestFn);
        expect(response).toStrictEqual('works');
      });

      it('Should pass on invalid promise 1 time and then success', async () => {
        const instance = new RetryUtil({
          errorMessage: 'error message',
          maxTries: 10
        });
        const jestFn = jest.fn().mockImplementation(async (error: boolean) => {
          if (error) {
            return Promise.resolve('works');
          }
          throw new Error('invalid');
        });
        const response = await instance.retry(jestFn);
        expect(response).toStrictEqual('works');
        expect(jestFn).toBeCalledTimes(2);
      });
    });

    describe('on failure', () => {
      it('Should fails on 10 times call fails', async () => {
        const instance = new RetryUtil({
          errorMessage: 'error message',
          maxTries: 10
        });
        const jestFn = jest.fn().mockImplementation(() => {
          throw new Error('error');
        });
        try {
          await instance.retry(jestFn);
        } catch (e) {
          expect((<Error>e).message).toStrictEqual('error');
          expect(jestFn).toBeCalledTimes(10);
        }
      });
    });
  });
});
