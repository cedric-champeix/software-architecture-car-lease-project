/**
 * Generic validation handler using the Chain of Responsibility pattern.
 * Can be used with any use case input and repository type.
 *
 * @template TInput - The input type for the validation (e.g., CreateClientUseCaseInput)
 */
export abstract class ValidationHandler<TInput> {
  protected nextHandler: ValidationHandler<TInput> | null = null;

  /**
   * Sets the next handler in the validation chain.
   * @param handler - The next validation handler to execute
   * @returns The handler that was set, allowing for method chaining
   */
  public setNext(
    handler: ValidationHandler<TInput>,
  ): ValidationHandler<TInput> {
    this.nextHandler = handler;
    return handler;
  }

  /**
   * Validates the input and passes to the next handler if validation succeeds.
   * @param input - The input data to validate
   * @throws Error if validation fails
   */
  public async validate(input: TInput): Promise<void> {
    await this.doValidate(input);

    if (this.nextHandler) {
      await this.nextHandler.validate(input);
    }
  }

  /**
   * Performs the actual validation logic.
   * Must be implemented by concrete validation handlers.
   * @param input - The input data to validate
   * @throws Error if validation fails
   */
  protected abstract doValidate(input: TInput): Promise<void>;
}
