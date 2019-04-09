import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {ResetWizardDirective} from './reset-wizard.directive';
import {WizardComponent} from '../components/wizard.component';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1'>
        Step 1
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>
        Step 2
        <button type="button" awResetWizard>
          Reset (normal)
        </button>
        <button type="button" awResetWizard (finalize)='cleanup()'>
          Reset (cleanup)
        </button>
      </aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public eventLog: Array<string> = [];

  public cleanup(): void {
    this.eventLog.push('Cleanup done!');
  }
}

describe('ResetWizardDirective', () => {
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

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(By.directive(ResetWizardDirective))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.directive(ResetWizardDirective)).length).toBe(2);
  });

  it('should reset the wizard correctly without finalize input', fakeAsync(() => {
    const resetButtons = wizardTestFixture.debugElement.queryAll(By.directive(ResetWizardDirective));

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.getStepAtIndex(0).selected).toBe(false);
    expect(wizard.getStepAtIndex(0).completed).toBe(true);
    expect(wizard.getStepAtIndex(1).selected).toBe(true);
    expect(wizard.getStepAtIndex(1).completed).toBe(false);
    expect(wizardTest.eventLog).toEqual([]);

    resetButtons[0].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.getStepAtIndex(0).selected).toBe(true);
    expect(wizard.getStepAtIndex(0).completed).toBe(false);
    expect(wizard.getStepAtIndex(1).selected).toBe(false);
    expect(wizard.getStepAtIndex(1).completed).toBe(false);
    expect(wizardTest.eventLog).toEqual([]);
  }));

  it('should reset the wizard correctly with finalize input', fakeAsync(() => {
    const resetButtons = wizardTestFixture.debugElement.queryAll(By.directive(ResetWizardDirective));

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.getStepAtIndex(0).selected).toBe(false);
    expect(wizard.getStepAtIndex(0).completed).toBe(true);
    expect(wizard.getStepAtIndex(1).selected).toBe(true);
    expect(wizard.getStepAtIndex(1).completed).toBe(false);
    expect(wizardTest.eventLog).toEqual([]);

    resetButtons[1].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.getStepAtIndex(0).selected).toBe(true);
    expect(wizard.getStepAtIndex(0).completed).toBe(false);
    expect(wizard.getStepAtIndex(1).selected).toBe(false);
    expect(wizard.getStepAtIndex(1).completed).toBe(false);
    expect(wizardTest.eventLog).toEqual(['Cleanup done!']);
  }));
});
