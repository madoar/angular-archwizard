import { WizardComponent } from '../components/wizard.component';

/**
 * Check wizard state and cause the current unit test to fail if the actual state does not match the expected.
 *
 * @param wizard Wizard component under test
 * @param selectedStepIndex Expected selected step index
 * @param completedStepIndexes Array of step indexes expected to be completed
 * @param wizardCompleted Whether the whole wizard is expected to be completed
 */
export function checkWizardState(
  wizard: WizardComponent,
  selectedStepIndex: number,
  completedStepIndexes: number[],
  wizardCompleted: boolean,
): void {
  expect(wizard.currentStepIndex).toBe(selectedStepIndex, `expected current step index to be ${selectedStepIndex}`);

  wizard.wizardSteps.forEach((step, index) => {
    // Only the selected step should be selected
    expect(step.selected).toBe(index === selectedStepIndex, `expected only step ${index} to be selected`);

    // All steps before the selected step need to be completed
    expect(step.completed).toBe(completedStepIndexes.includes(index),
      `expected step ${index} ${completedStepIndexes.includes(index) ? 'to be completed' : 'not to be completed'}`);
  });

  expect(wizard.completed).toBe(wizardCompleted,
    `expected wizard ${wizardCompleted ? 'to be completed' : 'not to be completed'}`);
}
