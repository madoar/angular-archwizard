/**
 * Created by marc on 29.06.17.
 */
import {Component, ViewChild} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {ComponentFixture, async, TestBed} from '@angular/core/testing';
import {WizardStepComponent} from '../components/wizard-step.component';
import {WizardCompletionStepComponent} from '../components/wizard-completion-step.component';
import {WizardModule} from '../wizard.module';
import {isWizardStep} from './wizard-step.interface';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step #step1 title='Steptitle 1'>
        Step 1
      </wizard-step>
      <wizard-step #step2 title='Steptitle 2' optionalStep>
        Step 2
      </wizard-step>
      <wizard-completion-step #step3 title='Steptitle 3'>
        Step 3
      </wizard-completion-step>
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  @ViewChild('step1')
  public step1: WizardStepComponent;

  @ViewChild('step2')
  public step2: WizardStepComponent;

  @ViewChild('step3')
  public step3: WizardCompletionStepComponent;

}

describe('WizardStep', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [WizardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;
    wizardTestFixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(wizardTest.step1).toBeDefined();
    expect(wizardTest.step2).toBeDefined();
    expect(wizardTest.step3).toBeDefined();
  });

  it('should fulfill isStepWizard', () => {
    expect(isWizardStep(wizardTest.step1)).toBe(true, 'Step 1 couldn\'t be identified as a WizardStep');
    expect(isWizardStep(wizardTest.step2)).toBe(true, 'Step 2 couldn\'t be identified as a WizardStep');
    expect(isWizardStep(wizardTest.step3)).toBe(true, 'Step 3 couldn\'t be identified as a WizardStep');
  });

  it('should not fulfill isStepWizard', () => {
    expect(isWizardStep(1)).toBe(false);
    expect(isWizardStep('1')).toBe(false);
    expect(isWizardStep({stepOffset: 1})).toBe(false);
  });
});
