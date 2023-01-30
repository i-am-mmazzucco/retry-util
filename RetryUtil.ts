interface RetryOptions {
  errorMessage: string;
  maxTries?: number;
}

export class RetryUtil {
  tries = 1;
  maxTries: number;
  errorMessage: string;

  constructor(options: RetryOptions) {
    this.errorMessage = options.errorMessage;
    this.maxTries = options.maxTries || 3;
  }

  async retry<T>(callback: (error: boolean) => Promise<T>): Promise<T> {
    try {
      return await callback(false);
    } catch (e) {
      // Here we can put a logger.
      console.warn(
        `${this.errorMessage}. Trying again... ${this.tries}/${this.maxTries}`
      );
      this.tries++;
      if (this.tries <= this.maxTries) {
        return await this.retry(() => callback(true));
      } else {
        throw e;
      }
    }
  }
}
