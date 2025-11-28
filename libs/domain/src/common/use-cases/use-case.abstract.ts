/**
 * Abstract base class for all use cases in the domain layer.
 * Enforces the Command Design Pattern by requiring all use cases to implement an execute method.
 *
 * @template TInput - The input type for the use case
 * @template TOutput - The output type returned by the use case
 *
 * @example
 * ```typescript
 * export type CreateClientUseCaseInput = {
 *   email: string;
 *   firstName: string;
 *   lastName: string;
 * };
 *
 * export class CreateClientUseCase extends UseCase<CreateClientUseCaseInput, Client> {
 *   constructor(private readonly repository: ClientRepository) {
 *     super();
 *   }
 *
 *   async execute(input: CreateClientUseCaseInput): Promise<Client> {
 *     // Use case implementation
 *   }
 * }
 * ```
 */
export abstract class UseCase<TInput, TOutput> {
  /**
   * Executes the use case with the provided input.
   * This method must be implemented by all concrete use cases.
   *
   * @param input - The input data for the use case
   * @returns A promise that resolves to the output of the use case
   */
  abstract execute(input: TInput): Promise<TOutput>;
}
