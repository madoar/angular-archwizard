import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardState} from './wizard-state.model';
import {WizardComponent} from '../components/wizard.component';
import {NavigationMode} from './navigation-mode.interface';
import {SemiStrictNavigationMode} from './semi-strict-navigation-mode';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard navigationMode="semi-strict">
      <aw-wizard-step stepTitle='Steptitle 1'>Step 1</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>Step 2</aw-wizard-step>
      <aw-wizard-completion-step awEnableBackLinks stepTitle='Completion Steptitle'>Step 3</aw-wizard-completion-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  private wizard: WizardComponent;
}

describe('SemiStrictNavigationMode', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardState: WizardState;
  let navigationMode: NavigationMode;

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
    wizardState = wizardTestFixture.debugElement.query(By.css('aw-wizard')).injector.get(WizardState);
    navigationMode = wizardState.navigationMode;
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard'))).toBeTruthy();
    expect(navigationMode instanceof SemiStrictNavigationMode).toBe(true,
      'Navigation mode is not an instance of SemiStrictNavigationMode');
  });

  it('should return correct can go to step', async(() => {
    navigationMode.canGoToStep(-1).then(result => expect(result).toBe(false));
    navigationMode.canGoToStep(0).then(result => expect(result).toBe(true));
    navigationMode.canGoToStep(1).then(result => expect(result).toBe(true));
    navigationMode.canGoToStep(2).then(result => expect(result).toBe(false));
    navigationMode.canGoToStep(3).then(result => expect(result).toBe(false));
  }));

  it('should go to step', fakeAsync(() => {
    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(true);
    expect(wizardState.getStepAtIndex(2).completed).toBe(true);
    expect(wizardState.completed).toBe(true);

    navigationMode.goToStep(0);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(true);
    expect(wizardState.getStepAtIndex(2).completed).toBe(true);
    expect(wizardState.completed).toBe(true);

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);
  }));

  it('should go to next step', fakeAsync(() => {
    navigationMode.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);
  }));

  it('should go to previous step', fakeAsync(() => {
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    navigationMode.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);
  }));

  it('should stay at the current step', fakeAsync(() => {
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);

    navigationMode.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    navigationMode.goToStep(-1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    navigationMode.goToStep(0);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);
  }));

  it('should reset the wizard correctly', fakeAsync(() => {
    navigationMode.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    navigationMode.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(true);
    expect(wizardState.getStepAtIndex(2).completed).toBe(true);
    expect(wizardState.completed).toBe(true);

    navigationMode.reset();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    wizardState.defaultStepIndex = -1;
    expect(() => navigationMode.reset()).toThrow(new Error(`The wizard doesn't contain a step with index -1`));

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    wizardState.defaultStepIndex = 2;
    expect(() => navigationMode.reset()).toThrow(new Error(`The default step index 2 references a completion step`));

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    wizardState.defaultStepIndex = 1;
    navigationMode.reset();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);
  }));
});
