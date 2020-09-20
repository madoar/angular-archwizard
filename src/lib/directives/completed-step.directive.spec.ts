import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ArchwizardModule } from '../archwizard.module';
import { WizardComponent } from '../components/wizard.component';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1'>Step 1</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2' awCompletedStep>Step 2</aw-wizard-step>
      <!-- Check if the awCompletedStep directive can be used conditionally -->
      <aw-wizard-step stepTitle='Steptitle 3' [awCompletedStep]="false">Step 3</aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('WizardStep', () => {
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizard: WizardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [ArchwizardModule]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();

    wizard = wizardTestFixture.componentInstance.wizard;

    // wait a tick to ensure that the initialization has been completed
    tick();
    wizardTestFixture.detectChanges();
  }));

  it('should mark initially completed steps', () => {
    expect(wizard.getStepAtIndex(0).completed).toBe(false);
    expect(wizard.getStepAtIndex(1).completed).toBe(true);
    expect(wizard.getStepAtIndex(2).completed).toBe(false);
  });

  it('should mark initially completed steps after wizard is reset', fakeAsync(() => {
    // scroll the wizard to the last step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.getStepAtIndex(0).completed).toBe(true);
    expect(wizard.getStepAtIndex(1).completed).toBe(true);
    expect(wizard.getStepAtIndex(2).completed).toBe(false);

    wizard.reset();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.getStepAtIndex(0).completed).toBe(false);
    expect(wizard.getStepAtIndex(1).completed).toBe(true);  // Step 1 is initially completed
    expect(wizard.getStepAtIndex(2).completed).toBe(false);
  }));
});
