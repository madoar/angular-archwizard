/**
 * Created by marc on 12.04.17.
 */

/**
 * An offset between two steps.
 * This offset can be either positive or negative.
 * A positive offset means, that the offset step is after the other step, while a negative offset means,
 * that the offset step is ahead of the other step.
 */
export interface StepOffset {
  stepOffset: number
}

/**
 * This method returns true, if the given value is a StepOffset
 * @param value The value to be checked
 * @returns {boolean}
 */
export function isStepOffset(value: any): value is StepOffset {
  return value.stepOffset !== undefined;
}
