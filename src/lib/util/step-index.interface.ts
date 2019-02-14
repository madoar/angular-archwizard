/**
 * An index of a wizard step.
 * This index is the index of the step inside the wizard.
 * The index is always zero based, i.e. the step with index 0 is the first step of the wizard
 *
 * @author Marc Arndt
 */
export interface StepIndex {
  /**
   * The index of the destination step
   */
  stepIndex: number;
}

/**
 * Checks whether the given `value` implements the interface [[StepIndex]].
 *
 * @param value The value to be checked
 * @returns True if the given value implements [[StepIndex]] and false otherwise
 */
export function isStepIndex(value: any): value is StepIndex {
  return value.hasOwnProperty('stepIndex');
}
