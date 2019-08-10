import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardComponent} from './wizard.component';
import {WizardStep} from '../util/wizard-step.interface';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard
      [disableNavigationBar]="disableNavigationBar" [defaultStepIndex]="defaultStepIndex"
      [awNavigationMode] [navigateForward]="navigateForward" [navigateBackward]="navigateBackward">
      <aw-wizard-step stepTitle='Steptitle 1' *ngIf="showStep1">
        Step 1
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>
        Step 2
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3' *ngIf="showStep3">
        Step 3
      </aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent implements AfterViewInit {
  public navigateForward = 'deny';
  public navigateBackward = 'deny';

  public disableNavigationBar = false;

  public defaultStepIndex = 0;

  public showStep1 = true;
  public showStep3 = true;

  @ViewChild(WizardComponent, {static: false})
  public wizard: WizardComponent;

  constructor(private _changeDetectionRef: ChangeDetectorRef) {
  }

  public ngAfterViewInit(): void {
    // Force another change detection in order to fix an occuring ExpressionChangedAfterItHasBeenCheckedError
    this._changeDetectionRef.detectChanges();
  }
}

describe('WizardComponent', () => {
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardTest: WizardTestComponent;
  let wizard: WizardComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [ArchwizardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();

    wizardTest = wizardTestFixture.componentInstance;
    wizard = wizardTest.wizard;
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizard).toBeTruthy();
  });

  it('should contain navigation bar at the correct position in default navBarLocation mode', () => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));
    const wizardEl = wizardTestFixture.debugElement.query(By.css('aw-wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBarEl).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :first-child')).name).toBe('aw-wizard-navigation-bar');
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :last-child')).name).toBe('div');

    expect(navBarEl.classes).toEqual({
      'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false
    });
    expect(wizardEl.classes).toEqual({'horizontal': true, 'vertical': false});
    expect(wizardStepsDiv.classes).toEqual({'wizard-steps': true, 'horizontal': true, 'vertical': false});
  });

  it('should contain navigation bar at the correct position in top navBarLocation mode', () => {
    wizard.navBarLocation = 'top';
    wizardTestFixture.detectChanges();

    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));
    const wizardEl = wizardTestFixture.debugElement.query(By.css('aw-wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBarEl).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :first-child')).name).toBe('aw-wizard-navigation-bar');
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :last-child')).name).toBe('div');

    expect(navBarEl.classes).toEqual({
      'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false
    });
    expect(wizardEl.classes).toEqual({'horizontal': true, 'vertical': false});
    expect(wizardStepsDiv.classes).toEqual({'wizard-steps': true, 'horizontal': true, 'vertical': false});
  });

  it('should contain navigation bar at the correct position in left navBarLocation mode', () => {
    wizard.navBarLocation = 'left';
    wizardTestFixture.detectChanges();

    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));
    const wizardEl = wizardTestFixture.debugElement.query(By.css('aw-wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBarEl).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :first-child')).name).toBe('aw-wizard-navigation-bar');
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :last-child')).name).toBe('div');

    expect(navBarEl.classes).toEqual({
      'horizontal': false, 'vertical': true, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false
    });
    expect(wizardEl.classes).toEqual({'horizontal': false, 'vertical': true});
    expect(wizardStepsDiv.classes).toEqual({'wizard-steps': true, 'horizontal': false, 'vertical': true});
  });

  it('should contain navigation bar at the correct position in bottom navBarLocation mode', () => {
    wizard.navBarLocation = 'bottom';
    wizardTestFixture.detectChanges();

    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));
    const wizardEl = wizardTestFixture.debugElement.query(By.css('aw-wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBarEl).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :first-child')).name).toBe('div');
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :last-child')).name).toBe('aw-wizard-navigation-bar');

    expect(navBarEl.classes).toEqual({
      'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false
    });
    expect(wizardEl.classes).toEqual({'horizontal': true, 'vertical': false});
    expect(wizardStepsDiv.classes).toEqual({'wizard-steps': true, 'horizontal': true, 'vertical': false});
  });

  it('should contain navigation bar at the correct position in right navBarLocation mode', () => {
    wizard.navBarLocation = 'right';
    wizardTestFixture.detectChanges();

    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));
    const wizardEl = wizardTestFixture.debugElement.query(By.css('aw-wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBarEl).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :first-child')).name).toBe('div');
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :last-child')).name).toBe('aw-wizard-navigation-bar');

    expect(navBarEl.classes).toEqual({
      'horizontal': false, 'vertical': true, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false
    });
    expect(wizardEl.classes).toEqual({'horizontal': false, 'vertical': true});
    expect(wizardStepsDiv.classes).toEqual({'wizard-steps': true, 'horizontal': false, 'vertical': true});
  });

  it('should change the navigation mode correctly during runtime', () => {
    const oldNavigation = wizard.navigation;

    wizardTest.navigateForward = 'allow';
    wizardTest.navigateBackward = 'allow';
    wizardTestFixture.detectChanges();

    expect(wizard.navigation).not.toBe(oldNavigation);
  });

  it('should change disableNavigationBar correctly during runtime', () => {
    expect(wizard.disableNavigationBar).toBe(false);

    wizardTest.disableNavigationBar = true;
    wizardTestFixture.detectChanges();

    expect(wizard.disableNavigationBar).toBe(true);
  });

  it('should change defaultStepIndex correctly during runtime', () => {
    expect(wizard.defaultStepIndex).toBe(0);

    wizardTest.defaultStepIndex = 1;
    wizardTestFixture.detectChanges();

    expect(wizard.defaultStepIndex).toBe(1);
  });

  it('should react on a previous step removal and insertion correctly', fakeAsync(() => {
    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.wizardSteps.length).toBe(3);

    wizardTest.showStep1 = false;
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(0);
    expect(wizard.wizardSteps.length).toBe(2);

    wizardTest.showStep1 = true;
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.wizardSteps.length).toBe(3);
  }));

  it('should react on a later step removal and insertion correctly', fakeAsync(() => {
    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.wizardSteps.length).toBe(3);

    wizardTest.showStep3 = false;
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.wizardSteps.length).toBe(2);

    wizardTest.showStep3 = true;
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.wizardSteps.length).toBe(3);
  }));

  it('should react on a combined removal and insertion of previous and later steps correctly', fakeAsync(() => {
    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.wizardSteps.length).toBe(3);

    wizardTest.showStep1 = false;
    wizardTest.showStep3 = false;
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(0);
    expect(wizard.wizardSteps.length).toBe(1);

    wizardTest.showStep1 = true;
    wizardTest.showStep3 = true;
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.wizardSteps.length).toBe(3);
  }));

  it('should have steps', () => {
    expect(wizard.wizardSteps.length).toBe(3);
  });

  it('should start at first step', () => {
    expect(wizard.currentStepIndex).toBe(0);
    expect(wizard.currentStep.stepTitle).toBe('Steptitle 1');

    checkWizardSteps(wizard.wizardSteps, 0);
  });

  it('should return correct step at index', () => {
    expect(() => wizard.getStepAtIndex(-1))
      .toThrow(new Error(`Expected a known step, but got stepIndex: -1.`));

    expect(wizard.getStepAtIndex(0).stepTitle).toBe('Steptitle 1');
    expect(wizard.getStepAtIndex(1).stepTitle).toBe('Steptitle 2');
    expect(wizard.getStepAtIndex(2).stepTitle).toBe('Steptitle 3');

    // Check that the first wizard step is the only selected one
    checkWizardSteps(wizard.wizardSteps, 0);

    expect(() => wizard.getStepAtIndex(3))
      .toThrow(new Error(`Expected a known step, but got stepIndex: 3.`));
  });

  it('should return correct index at step', () => {
    expect(wizard.getIndexOfStep(wizard.getStepAtIndex(0))).toBe(0);
    expect(wizard.getIndexOfStep(wizard.getStepAtIndex(1))).toBe(1);
    expect(wizard.getIndexOfStep(wizard.getStepAtIndex(2))).toBe(2);
  });

  it('should have next step', () => {
    expect(wizard.hasNextStep()).toBe(true);

    wizard.currentStepIndex++;

    expect(wizard.hasNextStep()).toBe(true);

    wizard.currentStepIndex++;

    expect(wizard.hasNextStep()).toBe(false);
  });

  it('should have previous step', () => {
    expect(wizard.hasPreviousStep()).toBe(false);

    wizard.currentStepIndex++;

    expect(wizard.hasPreviousStep()).toBe(true);

    wizard.currentStepIndex++;

    expect(wizard.hasPreviousStep()).toBe(true);
  });

  it('should be last step', () => {
    expect(wizard.isLastStep()).toBe(false);

    wizard.currentStepIndex++;

    expect(wizard.isLastStep()).toBe(false);

    wizard.currentStepIndex++;

    expect(wizard.isLastStep()).toBe(true);
  });

  it('should return null when staying in an incorrect step', () => {
    wizard.currentStepIndex = -1;
    expect(wizard.currentStep).toBeNull();
  });

});


function checkWizardSteps(steps: WizardStep[], selectedStepIndex: number) {
  steps.forEach((step, index) => {
    // Only the selected step should be selected
    if (index === selectedStepIndex) {
      expect(step.selected).toBe(true, `the selected wizard step index ${index} is not selected`);
    } else {
      expect(step.selected).toBe(false, `the not selected wizard step index ${index} is selected`);
    }

    // All steps before the selected step need to be completed
    if (index < selectedStepIndex) {
      expect(step.completed).toBe(true,
        `the wizard step ${index} is not completed while the currently selected step index is ${selectedStepIndex}`);
    } else if (index > selectedStepIndex) {
      expect(step.completed).toBe(false,
        `the wizard step ${index} is completed while the currently selected step index is ${selectedStepIndex}`);
    }
  });
}
