import {Component, forwardRef, Host, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardStepDirective} from './wizard-step.directive';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <div awWizardStep stepTitle='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">
        Step 1
      </div>
      <aw-test-wizard-step awWizardStep stepTitle='Steptitle 2' awOptionalStep>
        Step 2
      </aw-test-wizard-step>
      <div awWizardStep stepTitle='Steptitle 3' (stepEnter)="enterInto($event, 3)" (stepExit)="exitFrom($event, 3)">
        Step 3
      </div>
    </aw-wizard>
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
  selector: 'aw-test-wizard-step',
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
    expect(wizardTestFixture.debugElement.queryAll(By.directive(WizardStepDirective)).length).toBe(3);
  });
});
