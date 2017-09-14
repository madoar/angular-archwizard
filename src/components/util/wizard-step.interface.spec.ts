/**
 * Created by marc on 29.06.17.
 */
import {Component, ViewChild} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {ComponentFixture, async, TestBed} from '@angular/core/testing';
import {WizardStepComponent} from '../components/wizard-step.component';
import {WizardCompletionStepComponent} from '../components/wizard-completion-step.component';
import {WizardModule} from '../wizard.module';
import {WizardStep} from './wizard-step.interface';
import {WizardCompletionStepDirective} from '../directives/wizard-completion-step.directive';
import {WizardStepDirective} from '../directives/wizard-step.directive';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {By} from '@angular/platform-browser';
import {MovingDirection} from './moving-direction.enum';

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
      <wizard-step [canEnter]="canEnter" [canExit]="canExit" #step3>
        <ng-template wizardStepTitle>
          Steptitle 3
        </ng-template>
        Step 3
      </wizard-step>
      <div wizardStep #step4 title='Steptitle 4'>
        Step 4
      </div>
      <wizard-completion-step #step5 title='Steptitle 5'>
        Step 5
      </wizard-completion-step>
      <div wizardCompletionStep #step6 title='Steptitle 6'>
        Step 6
      </div>
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
  public step3: WizardStepComponent;

  @ViewChild('step4', {read: WizardStepDirective})
  public step4: WizardStepDirective;

  @ViewChild('step5')
  public step5: WizardCompletionStepComponent;

  @ViewChild('step6', {read: WizardCompletionStepDirective})
  public step6: WizardCompletionStepDirective;

  public canEnter: any = true;

  public canExit: any = true;
}

describe('WizardStep', () => {
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

  it('should create an instance', () => {
    expect(wizardTest.step1).toBeDefined();
    expect(wizardTest.step2).toBeDefined();
    expect(wizardTest.step3).toBeDefined();
    expect(wizardTest.step4).toBeDefined();
    expect(wizardTest.step5).toBeDefined();
    expect(wizardTest.step6).toBeDefined();

    expect(wizardTest.wizard.wizardSteps.length).toBe(6);
  });

  it('should be a WizardStep', () => {
    expect(wizardTest.step1 instanceof WizardStep).toBe(true, 'Step 1 couldn\'t be identified as a WizardStep');
    expect(wizardTest.step2 instanceof WizardStep).toBe(true, 'Step 2 couldn\'t be identified as a WizardStep');
    expect(wizardTest.step3 instanceof WizardStep).toBe(true, 'Step 3 couldn\'t be identified as a WizardStep');
    expect(wizardTest.step4 instanceof WizardStep).toBe(true, 'Step 4 couldn\'t be identified as a WizardStep');
    expect(wizardTest.step5 instanceof WizardStep).toBe(true, 'Step 5 couldn\'t be identified as a WizardStep');
    expect(wizardTest.step6 instanceof WizardStep).toBe(true, 'Step 6 couldn\'t be identified as a WizardStep');
  });

  it('should not be a WizardStep', () => {
    expect({stepOffset: 1} instanceof WizardStep).toBe(false);
    expect({title: 'Test title'} instanceof WizardStep).toBe(false);
  });

  it('should evaluate canEnter correctly', () => {
    expect(navigationMode.canGoToStep(2)).toBe(true);

    wizardTest.canEnter = true;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(2)).toBe(true);

    wizardTest.canEnter = false;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(2)).toBe(false);

    wizardTest.canEnter = (direction) => direction === MovingDirection.Forwards;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(2)).toBe(true);

    wizardTest.canEnter = (direction) => direction === MovingDirection.Backwards;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(2)).toBe(false);

    wizardTest.canEnter = 'malformed input';
    wizardTestFixture.detectChanges();

    expect(() => navigationMode.canGoToStep(2))
      .toThrow(new Error(`Input value 'malformed input' is neither a boolean nor a function`));
  });

  it('should evaluate canExit correctly', () => {
    navigationMode.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(1)).toBe(true);
    expect(navigationMode.canGoToStep(3)).toBe(true);

    wizardTest.canExit = true;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(1)).toBe(true);
    expect(navigationMode.canGoToStep(3)).toBe(true);

    wizardTest.canExit = false;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(1)).toBe(false);
    expect(navigationMode.canGoToStep(3)).toBe(false);

    wizardTest.canExit = (direction) => direction === MovingDirection.Forwards;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(1)).toBe(false);
    expect(navigationMode.canGoToStep(3)).toBe(true);

    wizardTest.canExit = (direction) => direction === MovingDirection.Backwards;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(1)).toBe(true);
    expect(navigationMode.canGoToStep(3)).toBe(false);

    wizardTest.canExit = 'malformed input';
    wizardTestFixture.detectChanges();

    expect(() => navigationMode.canGoToStep(1))
      .toThrow(new Error(`Input value 'malformed input' is neither a boolean nor a function`));
    expect(() => navigationMode.canGoToStep(3))
      .toThrow(new Error(`Input value 'malformed input' is neither a boolean nor a function`));
  });
});
