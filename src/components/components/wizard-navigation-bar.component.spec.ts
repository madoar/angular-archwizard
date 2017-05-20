/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ViewChild, Component} from '@angular/core';
import {WizardNavigationBarComponent} from './wizard-navigation-bar.component';
import {WizardComponent} from './wizard.component';
import {WizardStepComponent} from './wizard-step.component';
import {GoToStepDirective} from '../directives/go-to-step.directive';
import {By} from '@angular/platform-browser';
import {OptionalStepDirective} from '../directives/optional-step.directive';

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
      declarations: [ WizardComponent, WizardStepComponent, WizardNavigationBarComponent,
        WizardTestComponent, GoToStepDirective, OptionalStepDirective ]
    }).compileComponents();
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

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));

    // the first step is the current step
    expect(currentLi.length).toBe(1);
    expect(currentLi[0]).toBe(allLi[0]);

    // no step is currently marked as done
    expect(doneLi.length).toBe(0);

    // no step is marked as editing
    expect(editingLi.length).toBe(0);

    // only the second step is marked as optional
    expect(optionalLi.length).toBe(1);
    expect(optionalLi[0]).toBe(allLi[1]);

    // the second and third step is marked as default (neither done or current)
    expect(defaultLi.length).toBe(1);
    expect(defaultLi[0]).toBe(allLi[2]);
  });

  it('should show the second step correctly', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to second step
    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));

    // the second step is the current step
    expect(currentLi.length).toBe(1);
    expect(currentLi[0]).toBe(allLi[1]);

    // the first step should be marked as done
    expect(doneLi.length).toBe(1);
    expect(doneLi[0]).toBe(allLi[0]);

    // no step is marked as editing
    expect(editingLi.length).toBe(0);

    // no step is marked as optional, because the optional step is the current step
    expect(optionalLi.length).toBe(0);

    // only the third step is marked as default (neither done or current)
    expect(defaultLi.length).toBe(1);
    expect(defaultLi[0]).toBe(allLi[2]);
  });

  it('should show the third step correctly', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to second step
    wizardTest.wizard.goToNextStep();
    // go to third step
    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));

    // the third step is the current step
    expect(currentLi.length).toBe(1);
    expect(currentLi[0]).toBe(allLi[2]);

    // the first and second step should be marked as done
    expect(doneLi.length).toBe(2);
    expect(doneLi[0]).toBe(allLi[0]);
    expect(doneLi[1]).toBe(allLi[1]);

    // no step is marked as editing
    expect(editingLi.length).toBe(0);

    // no step is marked as optional, because the optional step is a "done" step
    expect(optionalLi.length).toBe(0);

    // no step is marked as default (neither done, current or optional)
    expect(defaultLi.length).toBe(0);
  });

  it('should show the third step correctly, after jump from first to third step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to third step and jump over the optional second step
    wizardTest.wizard.goToStep(2);
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));

    // the third step is the current step
    expect(currentLi.length).toBe(1);
    expect(currentLi[0]).toBe(allLi[2]);

    // the first step should be marked as done
    expect(doneLi.length).toBe(1);
    expect(doneLi[0]).toBe(allLi[0]);

    // no step is marked as editing
    expect(editingLi.length).toBe(0);

    // the second step is marked as optional, because we jumped over it
    expect(optionalLi.length).toBe(1);
    expect(optionalLi[0]).toBe(allLi[1]);

    // the second step is marked as default (neither done nor current)
    expect(defaultLi.length).toBe(0);
  });

  it('should show the first step correctly, after going back from the second step to the first step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to second step
    wizardTest.wizard.goToNextStep();
    // go back to first step
    wizardTest.wizard.goToPreviousStep();
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));

    // no step is the current step
    expect(currentLi.length).toBe(0);

    // no step should be marked as done
    expect(doneLi.length).toBe(0);

    // the first step is marked as editing
    expect(editingLi.length).toBe(1);
    expect(editingLi[0]).toBe(allLi[0]);

    // the second step is marked as optional
    expect(optionalLi.length).toBe(1);
    expect(optionalLi[0]).toBe(allLi[1]);

    // the second and third step is marked as default (neither done or current)
    expect(defaultLi.length).toBe(1);
    expect(defaultLi[0]).toBe(allLi[2]);
  });

  it('should show the first step correctly, after first jumping from the first to the third step ' +
    'and then back from the third step to the first step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to third step, by jumping over the optional step
    wizardTest.wizard.goToStep(2);
    // go back to first step
    wizardTest.wizard.goToStep(0);
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));

    // no step is the current step
    expect(currentLi.length).toBe(0);

    // no step should be marked as done
    expect(doneLi.length).toBe(0);

    // the first step is marked as editing
    expect(editingLi.length).toBe(1);
    expect(editingLi[0]).toBe(allLi[0]);

    // the second step is marked as optional
    expect(optionalLi.length).toBe(1);
    expect(optionalLi[0]).toBe(allLi[1]);

    // the second and third step is marked as default (neither done or current)
    expect(defaultLi.length).toBe(1);
    expect(defaultLi[0]).toBe(allLi[2]);
  });

  it('should show the second step correctly, after first jumping from the first to the third step ' +
    'and then back from the third step to the second step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to third step, by jumping over the optional step
    wizardTest.wizard.goToStep(2);
    // go back to second step
    wizardTest.wizard.goToPreviousStep();
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));

    // the second step is the current step
    expect(currentLi.length).toBe(1);
    expect(currentLi[0]).toBe(allLi[1]);

    // the first step should be marked as done
    expect(doneLi.length).toBe(1);
    expect(doneLi[0]).toBe(allLi[0]);

    // no step is marked as editing
    expect(editingLi.length).toBe(0);

    // no step is marked as optional, because the optional step is the current step
    expect(optionalLi.length).toBe(0);

    // the third step is marked as default (neither done or current)
    expect(defaultLi.length).toBe(1);
    expect(defaultLi[0]).toBe(allLi[2]);
  });

  it('should move back to the first step from the second step, after clicking on the corresponding link', () => {
    const goToFirstStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(1) a')).nativeElement;

    expect(wizardTest.wizard.currentStepIndex).toBe(0);

    // go to the second step
    wizardTest.wizard.goToNextStep();
    expect(wizardTest.wizard.currentStepIndex).toBe(1);

    // go back to the first step
    goToFirstStepLink.click();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
  });

  it('should move back to the first step from the third step, after clicking on the corresponding link', () => {
    const goToFirstStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(1) a')).nativeElement;

    expect(wizardTest.wizard.currentStepIndex).toBe(0);

    // go to the second step
    wizardTest.wizard.goToStep(2);
    expect(wizardTest.wizard.currentStepIndex).toBe(2);

    // go back to the first step
    goToFirstStepLink.click();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
  });

  it('should move back to the second step from the third step, after clicking on the corresponding link', () => {
    const goToSecondStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(2) a')).nativeElement;

    expect(wizardTest.wizard.currentStepIndex).toBe(0);

    // go to the second step
    wizardTest.wizard.goToStep(2);
    expect(wizardTest.wizard.currentStepIndex).toBe(2);

    // go back to the first step
    goToSecondStepLink.click();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
  });

  it('should not move to the second step from the first step, after clicking on the corresponding link', () => {
    const goToFirstStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(1)'));
    const goToSecondStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(2)'));
    const goToThirdStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(3)'));

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    // links contain a class that is not clickable (contains "pointer-events: none;")
    expect(goToFirstStepLink.classes.hasOwnProperty('current')).toBeTruthy('First step label is clickable');
    expect(goToSecondStepLink.classes.hasOwnProperty('default')).toBeTruthy('Second step label is clickable');
    expect(goToThirdStepLink.classes.hasOwnProperty('default')).toBeTruthy('Third step label is clickable');
  });
});
