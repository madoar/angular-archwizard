/**
 * An offset between two steps.
 * This offset can be either positive or negative.
 * A positive offset means, that the offset step is after the other step, while a negative offset means,
 * that the offset step is ahead of the other step.
 *
 * @author Marc Arndt
 */
export interface StepOffset {
  /**
   * The offset to the destination step
   */
  stepOffset: number;
}

/**
 * Checks whether the given `value` implements the interface [[StepOffset]].
 *
 * @param value The value to be checked
 * @returns True if the given value implements [[StepOffset]] and false otherwise
 */
export function isStepOffset(value: any): value is StepOffset {
  return value.hasOwnProperty('stepOffset');
}
