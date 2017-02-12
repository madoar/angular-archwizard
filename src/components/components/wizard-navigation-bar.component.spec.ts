/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {ViewChild, Component} from "@angular/core";
import {WizardNavigationBarComponent} from "./wizard-navigation-bar.component";
import {WizardComponent} from "./wizard.component";
import {WizardStepComponent} from "./wizard-step.component";
import {GoToStepDirective} from "../directives/go-to-step.directive";
import {By} from "@angular/platform-browser";
import {OptionalStepDirective} from "../directives/optional-step.directive";

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step title='Steptitle 1'>Step 1</wizard-step>
      <wizard-step title='Steptitle 2' optionalStep>Step 2</wizard-step>
      <wizard-step title='Steptitle 3'>Step 3</wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('WizardNavigationBarComponent', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardComponent, WizardStepComponent, WizardNavigationBarComponent, WizardTestComponent, GoToStepDirective, OptionalStepDirective ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;
    wizardTestFixture.detectChanges();
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'))).toBeTruthy();
  });

  it('should create only one navigation bar', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-navigation-bar')).length).toBe(1);
  });

  it('should show the initial step correctly', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // the first step is the current step
    expect(navBar.query(By.css('li.current'))).toBeTruthy();
    expect(navBar.query(By.css('li.current'))).toBe(navBar.query(By.css('li:first-child')));
    expect(navBar.queryAll(By.css('li.current')).length).toBe(1);

    // no step is currently marked as done
    expect(navBar.query(By.css('li.done'))).toBeNull();

    // no step is marked as editing
    expect(navBar.query(By.css('li.editing'))).toBeNull();

    // only the second step is marked as optional
    expect(navBar.query(By.css('li.optional'))).toBeTruthy();
    expect(navBar.query(By.css('li.optional'))).toBe(navBar.query(By.css('li:nth-child(2)')));
    expect(navBar.queryAll(By.css('li.optional')).length).toBe(1);

    // only the third step is marked as default (neither done, current or optional)
    expect(navBar.query(By.css('li.default'))).toBeTruthy();
    expect(navBar.query(By.css('li.default'))).toBe(navBar.query(By.css('li:nth-child(3)')));
    expect(navBar.queryAll(By.css('li.default')).length).toBe(1);
  });

  it('should show the second step correctly', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to second step
    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    // the second step is the current step
    expect(navBar.query(By.css('li.current'))).toBeTruthy();
    expect(navBar.query(By.css('li.current'))).toBe(navBar.query(By.css('li:nth-child(2)')));
    expect(navBar.queryAll(By.css('li.current')).length).toBe(1);

    // the first step should be marked as done
    expect(navBar.query(By.css('li.done'))).toBeTruthy();
    expect(navBar.query(By.css('li.done'))).toBe(navBar.query(By.css('li:nth-child(1)')));
    expect(navBar.queryAll(By.css('li.done')).length).toBe(1);

    // no step is marked as editing
    expect(navBar.query(By.css('li.editing'))).toBeNull();

    // no step is marked as optional, because the optional step is the current step
    expect(navBar.query(By.css('li.optional'))).toBeNull();

    // only the third step is marked as default (neither done, current or optional)
    expect(navBar.query(By.css('li.default'))).toBeTruthy();
    expect(navBar.query(By.css('li.default'))).toBe(navBar.query(By.css('li:nth-child(3)')));
    expect(navBar.queryAll(By.css('li.default')).length).toBe(1);
  });

  it('should show the third step correctly', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to second step
    wizardTest.wizard.goToNextStep();
    // go to third step
    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    // the third step is the current step
    expect(navBar.query(By.css('li.current'))).toBeTruthy();
    expect(navBar.query(By.css('li.current'))).toBe(navBar.query(By.css('li:nth-child(3)')));
    expect(navBar.queryAll(By.css('li.current')).length).toBe(1);

    // the first and second step should be marked as done
    expect(navBar.query(By.css('li.done'))).toBeTruthy();
    expect(navBar.query(By.css('li.done:first-child'))).toBe(navBar.query(By.css('li:nth-child(1)')));
    expect(navBar.query(By.css('li.done:nth-child(2)'))).toBe(navBar.query(By.css('li:nth-child(2)')));
    expect(navBar.queryAll(By.css('li.done')).length).toBe(2);

    // no step is marked as editing
    expect(navBar.query(By.css('li.editing'))).toBeNull();

    // no step is marked as optional, because the optional step is a "done" step
    expect(navBar.query(By.css('li.optional'))).toBeNull();

    // no step is marked as default (neither done, current or optional)
    expect(navBar.query(By.css('li.default'))).toBeNull();
  });

  it('should show the third step correctly, after jump from first to third step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to third step and jump over the optional second step
    wizardTest.wizard.goToStep(2);
    wizardTestFixture.detectChanges();

    // the third step is the current step
    expect(navBar.query(By.css('li.current'))).toBeTruthy();
    expect(navBar.query(By.css('li.current'))).toBe(navBar.query(By.css('li:nth-child(3)')));
    expect(navBar.queryAll(By.css('li.current')).length).toBe(1);

    // the first step should be marked as done
    expect(navBar.query(By.css('li.done'))).toBeTruthy();
    expect(navBar.query(By.css('li.done'))).toBe(navBar.query(By.css('li:nth-child(1)')));
    expect(navBar.queryAll(By.css('li.done')).length).toBe(1);

    // no step is marked as editing
    expect(navBar.query(By.css('li.editing'))).toBeNull();

    // the second step is marked as optional, because we jumped over it
    expect(navBar.query(By.css('li.optional'))).toBeTruthy();
    expect(navBar.query(By.css('li.optional'))).toBe(navBar.query(By.css('li:nth-child(2)')));
    expect(navBar.queryAll(By.css('li.optional')).length).toBe(1);

    // no step is marked as default (neither done, current or optional)
    expect(navBar.query(By.css('li.default'))).toBeNull();
  });

  it('should show the first step correctly, after going back from the second step to the first step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to second step
    wizardTest.wizard.goToNextStep();
    // go back to first step
    wizardTest.wizard.goToPreviousStep();
    wizardTestFixture.detectChanges();

    // no step is the current step
    expect(navBar.query(By.css('li.current'))).toBeNull();

    // no step should be marked as done
    expect(navBar.query(By.css('li.done'))).toBeNull();

    // the first step is marked as editing
    expect(navBar.query(By.css('li.editing'))).toBeTruthy();
    expect(navBar.query(By.css('li.editing'))).toBe(navBar.query(By.css('li:nth-child(1)')));
    expect(navBar.queryAll(By.css('li.editing')).length).toBe(1);

    // the second step is marked as optional
    expect(navBar.query(By.css('li.optional'))).toBeTruthy();
    expect(navBar.query(By.css('li.optional'))).toBe(navBar.query(By.css('li:nth-child(2)')));
    expect(navBar.queryAll(By.css('li.optional')).length).toBe(1);

    // no step is marked as default (neither done, current or optional)
    expect(navBar.query(By.css('li.default'))).toBeTruthy();
    expect(navBar.query(By.css('li.default'))).toBe(navBar.query(By.css('li:nth-child(3)')));
    expect(navBar.queryAll(By.css('li.default')).length).toBe(1);
  });

  it('should show the first step correctly, after first jumping from the first to the third step and then back from the third step to the first step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to third step, by jumping over the optional step
    wizardTest.wizard.goToStep(2);
    // go back to first step
    wizardTest.wizard.goToStep(0);
    wizardTestFixture.detectChanges();

    // no step is the current step
    expect(navBar.query(By.css('li.current'))).toBeNull();

    // no step should be marked as done
    expect(navBar.query(By.css('li.done'))).toBeNull();

    // the first step is marked as editing
    expect(navBar.query(By.css('li.editing'))).toBeTruthy();
    expect(navBar.query(By.css('li.editing'))).toBe(navBar.query(By.css('li:nth-child(1)')));
    expect(navBar.queryAll(By.css('li.editing')).length).toBe(1);

    // the second step is marked as optional
    expect(navBar.query(By.css('li.optional'))).toBeTruthy();
    expect(navBar.query(By.css('li.optional'))).toBe(navBar.query(By.css('li:nth-child(2)')));
    expect(navBar.queryAll(By.css('li.optional')).length).toBe(1);

    // the third step is marked as default (neither done, current or optional)
    expect(navBar.query(By.css('li.default'))).toBeTruthy();
    expect(navBar.query(By.css('li.default'))).toBe(navBar.query(By.css('li:nth-child(3)')));
    expect(navBar.queryAll(By.css('li.default')).length).toBe(1);
  });

  it('should show the second step correctly, after first jumping from the first to the third step and then back from the third step to the second step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to third step, by jumping over the optional step
    wizardTest.wizard.goToStep(2);
    // go back to second step
    wizardTest.wizard.goToPreviousStep();
    wizardTestFixture.detectChanges();

    // the second step is the current step
    expect(navBar.query(By.css('li.current'))).toBeTruthy();
    expect(navBar.query(By.css('li.current'))).toBe(navBar.query(By.css('li:nth-child(2)')));
    expect(navBar.queryAll(By.css('li.current')).length).toBe(1);

    // the first step should be marked as done
    expect(navBar.query(By.css('li.done'))).toBeTruthy();
    expect(navBar.query(By.css('li.done'))).toBe(navBar.query(By.css('li:nth-child(1)')));
    expect(navBar.queryAll(By.css('li.done')).length).toBe(1);

    // no step is marked as editing
    expect(navBar.query(By.css('li.editing'))).toBeNull();

    // no step is marked as optional, because the optional step is the current step
    expect(navBar.query(By.css('li.optional'))).toBeNull();

    // the third step is marked as default (neither done, current or optional)
    expect(navBar.query(By.css('li.default'))).toBeTruthy();
    expect(navBar.query(By.css('li.default'))).toBe(navBar.query(By.css('li:nth-child(3)')));
    expect(navBar.queryAll(By.css('li.default')).length).toBe(1);
  });
});
