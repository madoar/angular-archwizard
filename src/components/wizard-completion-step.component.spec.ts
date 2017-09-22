/**
 * Created by marc on 20.05.17.
 */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {WizardCompletionStepComponent} from './wizard-completion-step.component';
import {Component} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {By} from '@angular/platform-browser';
import {WizardModule} from '../wizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step stepTitle='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">Step 1</wizard-step>
      <wizard-step stepTitle='Steptitle 2' [canExit]="isValid"
                   optionalStep (stepEnter)="enterInto($event, 2)" (stepExit)="exitFrom($event, 2)">Step 2</wizard-step>
      <wizard-completion-step stepTitle='Completion steptitle 3' (stepEnter)="enterInto($event, 3)">Step 3</wizard-completion-step>
    </wizard>
  `
})
class WizardTestComponent {
  public isValid: any = true;

  public eventLog: Array<string> = [];

  enterInto(direction: MovingDirection, destination: number): void {
    this.eventLog.push(`enter ${MovingDirection[direction]} ${destination}`);
  }

  exitFrom(direction: MovingDirection, source: number): void {
    this.eventLog.push(`exit ${MovingDirection[direction]} ${source}`);
  }
}

describe('WizardCompletionStepComponent', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;
  let wizardState: WizardState;
  let navigationMode: NavigationMode;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [WizardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();

    wizardTest = wizardTestFixture.componentInstance;
    wizardState = wizardTestFixture.debugElement.query(By.css('wizard')).injector.get(WizardState);
    navigationMode = wizardState.navigationMode;
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-step')).length).toBe(2);
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-completion-step')).length).toBe(1);
  });
});
