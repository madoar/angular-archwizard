/**
 * An interface describing the basic functionality, which must be provided by a navigation mode.
 * A navigation mode manages the navigation between different wizard steps, this contains the validation, if a step transition can be done
 *
 * @author Marc Arndt
 */
export interface NavigationMode {
  /**
   * Checks, whether a wizard step, as defined by the given destination index, can be transitioned to.
   *
   * @param {number} destinationIndex The index of the destination step
   * @returns {boolean} True if the destination step can be transitioned to, false otherwise
   */
  canGoToStep(destinationIndex: number): boolean;

  /**
   * Tries to transition to the wizard step, as denoted by the given destination index.
   * If this is not possible, the current wizard step should be exited and then reentered with `MovingDirection.Stay`
   *
   * @param {number} destinationIndex The index of the destination step
   */
  goToStep(destinationIndex: number): void;
}
