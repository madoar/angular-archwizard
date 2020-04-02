import { WizardComponent } from '../components/wizard.component';

/**
 * Check wizard state and cause the current unit test to fail if the actual state does not match the expected.
 *
 * @param wizard Wizard component under test
 * @param selectedStepIndex Expected selected step index
 * @param selectedStepEditing Whether the selected step is expected to be in "editing" state
 * @param completedStepIndexes Array of step indexes expected to be completed
 * @param wizardCompleted Whether the whole wizard is expected to be completed
 */
export function checkWizardState(
  wizard: WizardComponent,
  selectedStepIndex: number,
  selectedStepEditing: boolean,
  completedStepIndexes: number[],
  wizardCompleted: boolean,
): void {
  expect(wizard.currentStepIndex).toBe(selectedStepIndex, `expected current step index to be ${selectedStepIndex}`);

  wizard.wizardSteps.forEach((step, index) => {
    // Only the selected step should be selected
    expect(step.selected).toBe(index === selectedStepIndex, `expected only step ${index} to be selected`);

    // Check completed step indexes
    expect(step.completed).toBe(completedStepIndexes.includes(index),
      `expected step ${index} ${completedStepIndexes.includes(index) ? 'to be completed' : 'not to be completed'}`);

    // Check step "editing" state.  It is only applicable to the selected step.
    const expectation = index === selectedStepIndex && selectedStepEditing ? 'to be in editing state' : 'not to be in editing state';
    expect(step.editing).toBe(index === selectedStepIndex && selectedStepEditing, `expected step ${index} ${expectation}`);
  });

  // A step in "editing" state should also be completed
  if (selectedStepEditing) {
    expect(completedStepIndexes).toContain(selectedStepIndex,
      `expected step ${selectedStepIndex} to be completed, as follows from its assumed editing state`);
  }

  expect(wizard.completed).toBe(wizardCompleted,
    `expected wizard ${wizardCompleted ? 'to be completed' : 'not to be completed'}`);
}


/**
 * Check which wizard steps are navigable using the navigation bar
 *
 * @param wizard Wizard component under test
 * @param selectedStepIndex Expected selected step index
 * @param navigableStepIndexes Array of step indexes expected to be navigable using the navigation bar
 */
export function checkWizardNavigableSteps(
  wizard: WizardComponent,
  selectedStepIndex: number,
  navigableStepIndexes: number[],
): void {
  expect(wizard.currentStepIndex).toBe(selectedStepIndex, `expected current step index to be ${selectedStepIndex}`);

  wizard.wizardSteps.forEach((step, index) => {
    // Only the selected step should be selected
    expect(step.selected).toBe(index === selectedStepIndex, `expected only step ${index} to be selected`);

    // Check navigable step indexes
    expect(wizard.isNavigable(index)).toBe(navigableStepIndexes.includes(index),
      `expected step ${index} ${navigableStepIndexes.includes(index) ? 'to be navigable' : 'not to be navigable'}`);
  });
}

/**
 * Check if the expected classes exists on the element
 *
 * @param classes Element classes
 * @param expectedClasses Expected element classes
 */
export function checkClasses(classes: { [key: string]: boolean }, expectedClasses: string[]) {
    expect(
      Object.keys(classes).filter(m => classes[m] === true)
    ).toEqual(expectedClasses);
}
