import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ArchwizardModule } from '../archwizard.module';
import { WizardComponent } from './wizard.component';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard [defaultStepIndex]="0">
      <aw-wizard-step stepTitle='Steptitle 1' (stepEnter)="enterFirstStep()">
        Step 1
        {{counter}}
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
  public counter = 0;

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public enterFirstStep(): void {
    this.counter++;
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

  it('should contain the correct count after init', () => {
    expect(wizardTest.counter).toEqual(1);
  });

});
