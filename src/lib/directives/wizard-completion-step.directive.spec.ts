import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardCompletionStepDirective} from './wizard-completion-step.directive';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">
        Step 1
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2' [canExit]="isValid" awOptionalStep (stepEnter)="enterInto($event, 2)"
                      (stepExit)="exitFrom($event, 2)">
        Step 2
      </aw-wizard-step>
      <div awWizardCompletionStep stepTitle='Completion steptitle 3' (stepEnter)="enterInto($event, 3)">
        Step 3
      </div>
    </aw-wizard>
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

describe('WizardCompletionStepDirective', () => {
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
    expect(wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-step')).length).toBe(2);
    expect(wizardTestFixture.debugElement.queryAll(By.directive(WizardCompletionStepDirective)).length).toBe(1);
  });
});
