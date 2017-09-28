import {OptionalStepDirective} from './optional-step.directive';
import {Component} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {ResetWizardDirective} from './reset-wizard.directive';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step stepTitle='Steptitle 1'>
        Step 1
      </wizard-step>
      <wizard-step stepTitle='Steptitle 2'>
        Step 2
        <button type="button" resetWizard>Reset (normal)</button>
        <button type="button" resetWizard (finalize)='cleanup()'>Reset (cleanup)</button>
        <button type="button" reset (finalize)='cleanup()'>Reset (cleanup short)</button>
      </wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
  public eventLog: Array<string> = [];

  public cleanup(): void {
    this.eventLog.push('Cleanup done!');
  };
}

describe('ResetWizardDirective', () => {
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
    expect(wizardTestFixture.debugElement.query(By.directive(ResetWizardDirective))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.directive(ResetWizardDirective)).length).toBe(3);
  });

  it('should reset the wizard correctly 1', fakeAsync(() => {
    let resetButtons = wizardTestFixture.debugElement
      .queryAll(By.directive(ResetWizardDirective));

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardTest.eventLog).toEqual([]);

    resetButtons[0].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardTest.eventLog).toEqual([]);
  }));

  it('should reset the wizard correctly 2', fakeAsync(() => {
    let resetButtons = wizardTestFixture.debugElement
      .queryAll(By.directive(ResetWizardDirective));

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardTest.eventLog).toEqual([]);

    resetButtons[1].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardTest.eventLog).toEqual(['Cleanup done!']);
  }));

  it('should reset the wizard correctly 3', fakeAsync(() => {
    let resetButtons = wizardTestFixture.debugElement
      .queryAll(By.directive(ResetWizardDirective));

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardTest.eventLog).toEqual([]);

    resetButtons[2].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardTest.eventLog).toEqual(['Cleanup done!']);
  }));
});
