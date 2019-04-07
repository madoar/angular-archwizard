import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardComponent} from '../components/wizard.component';
import {FreeNavigationMode} from './free-navigation-mode';
import {NavigationMode} from './navigation-mode.interface';
import {WizardState} from './wizard-state.model';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard navigationMode="free">
      <aw-wizard-step stepTitle='Steptitle 1'>
        Step 1
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>
        Step 2
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3'>
        Step 3
      </aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('FreeNavigationMode', () => {
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardTest: WizardTestComponent;
  let wizard: WizardComponent;
  let wizardState: WizardState;

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
    wizardState = wizard.model;
  });

  it('should create', () => {
    expect(wizardState.navigationMode instanceof FreeNavigationMode).toBe(true,
      'Navigation mode is not an instance of FreeNavigationMode');
  });

  it('should return correct can go to step', async(() => {
    wizardState.canGoToStep(-1).then(result => expect(result).toBe(false));
    wizardState.canGoToStep(0).then(result => expect(result).toBe(true));
    wizardState.canGoToStep(1).then(result => expect(result).toBe(true));
    wizardState.canGoToStep(2).then(result => expect(result).toBe(true));
    wizardState.canGoToStep(3).then(result => expect(result).toBe(false));
  }));

  it('should go to step', fakeAsync(() => {
    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);

    wizardState.goToStep(1);
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

    wizardState.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(true);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    wizardState.goToStep(0);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(true);
    expect(wizardState.completed).toBe(true);

    wizardState.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(true);
    expect(wizardState.completed).toBe(true);

    wizardState.goToStep(2);
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

    wizardState.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(true);
    expect(wizardState.completed).toBe(true);
  }));

  it('should go to next step', fakeAsync(() => {
    wizardState.goToNextStep();
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

    wizardState.goToStep(1);
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

    wizardState.goToPreviousStep();
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

    wizardState.goToPreviousStep();
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

    wizardState.goToStep(-1);
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

    wizardState.goToStep(0);
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
    wizardState.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    wizardState.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(true);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    wizardState.reset();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    wizardState.defaultStepIndex = -1;
    expect(() => wizardState.reset())
      .toThrow(new Error(`The wizard doesn't contain a step with index -1`));

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    wizardState.defaultStepIndex = 2;
    wizardState.reset();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(true);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);
  }));
});
