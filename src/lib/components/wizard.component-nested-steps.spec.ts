import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ArchwizardModule } from '../archwizard.module';
import { WizardComponent } from './wizard.component';
import { WizardStep } from '../util/wizard-step.interface';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <div>
        <aw-wizard-step #firstStep stepTitle='Steptitle 1'>
          Step 1
        </aw-wizard-step>
      </div>
      <div>
        <aw-wizard-step #secondStep stepTitle='Steptitle 2'>
          Step 2
        </aw-wizard-step>
      </div>
      <div>
        <div>
          <aw-wizard-step #thirdStep stepTitle='Steptitle 3'>
            Step 3
          </aw-wizard-step>
        </div>
      </div>
    </aw-wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  @ViewChild('firstStep')
  public first: WizardStep;

  @ViewChild('secondStep')
  public second: WizardStep;

  @ViewChild('thirdStep')
  public third: WizardStep;
}

describe('WizardComponent with nested steps', () => {
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardTest: WizardTestComponent;
  let wizard: WizardComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [ArchwizardModule]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();

    wizardTest = wizardTestFixture.componentInstance;
    wizard = wizardTest.wizard;

    // wait a tick to ensure that the initialization has been completed
    tick();
    wizardTestFixture.detectChanges();
  }));

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizard).toBeTruthy();
  });

  it('should contain 3 steps', () => {
    expect(wizard.wizardSteps.length).toBe(3);

    expect(wizardTest.first).toBe(wizard.wizardSteps[0]);
    expect(wizardTest.second).toBe(wizard.wizardSteps[1]);
    expect(wizardTest.third).toBe(wizard.wizardSteps[2]);
  });
});
