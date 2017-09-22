import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, forwardRef, Host, ViewChild} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {By} from '@angular/platform-browser';
import {WizardModule} from '../wizard.module';
import {WizardStepDirective} from './wizard-step.directive';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <div wizardStep stepTitle='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">
        Step 1
      </div>
      <test-wizard-step wizardStep stepTitle='Steptitle 2' optionalStep>
        Step 2
      </test-wizard-step>
      <div wizardStep stepTitle='Steptitle 3' (stepEnter)="enterInto($event, 3)" (stepExit)="exitFrom($event, 3)">
        Step 3
      </div>
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(forwardRef(() => WizardStepTestComponent))
  public wizardStepTestComponent;

  public eventLog: Array<string> = [];

  enterInto(direction: MovingDirection, destination: number): void {
    this.eventLog.push(`enter ${MovingDirection[direction]} ${destination}`);
  }

  exitFrom(direction: MovingDirection, source: number): void {
    this.eventLog.push(`exit ${MovingDirection[direction]} ${source}`);
  }
}

@Component({
  selector: 'test-wizard-step',
  template: `
    Step 2
  `
})
class WizardStepTestComponent {
  constructor(@Host() private wizardStep: WizardStepDirective, wizard: WizardTestComponent) {
    wizardStep.stepEnter.emit = direction => wizard.enterInto(direction, 2);
    wizardStep.stepExit.emit = direction => wizard.exitFrom(direction, 2);
  }
}

describe('WizardStepDirective', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardState: WizardState;
  let navigationMode: NavigationMode;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent, WizardStepTestComponent],
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
    expect(wizardTestFixture.debugElement.queryAll(By.directive(WizardStepDirective)).length).toBe(3);
  });
});
