class Builder {
  private requiredString: string;
  private requiredInt: number;

  private optionalString?: string;
  private optionalInt?: number;

  constructor(requiredString: string, requiredInt: number) {
      this.requiredString = requiredString;
      this.requiredInt = requiredInt;
  }

  public withOptionalString(optionalString: string): Builder {
      this.optionalString = optionalString;
      return this;
  }

  public withOptionalInt(optionalInt: number): Builder {
      this.optionalInt = optionalInt;
      return this;
  }
}

// Usage example
const builder = new Builder('requiredString', 123)
  .withOptionalString('optionalString')
  .withOptionalInt(456);