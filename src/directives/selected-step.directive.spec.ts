import {Component} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {SelectedStepDirective} from './selected-step.directive';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard navigationMode="free">
      <wizard-step stepTitle='Steptitle 1'>
        Step 1
      </wizard-step>
      <wizard-step stepTitle='Steptitle 2' selectedStep>
        Step 2
      </wizard-step>
      <wizard-step stepTitle='Steptitle 3'>
        Step 3
      </wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
}

describe('SelectedStepDirective', () => {
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
    wizardState = wizardTestFixture.debugElement.query(By.css('wizard')).injector.get(WizardState);
    navigationMode = wizardState.navigationMode;
  });

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(By.directive(SelectedStepDirective))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.directive(SelectedStepDirective)).length).toBe(1);
  });

  it('should set optional correctly', () => {
    expect(wizardState.defaultStepIndex).toBe(1);
    expect(wizardState.currentStepIndex).toBe(1);
  });

  it('should reset correctly to the default selected step', fakeAsync(() => {
    navigationMode.goToStep(0);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);

    navigationMode.reset();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
  }));
});
