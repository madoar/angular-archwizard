import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {WizardNavigationBarComponent} from './wizard-navigation-bar.component';
import {WizardComponent} from './wizard.component';
import {By} from '@angular/platform-browser';
import {WizardModule} from '../wizard.module';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step stepTitle='Steptitle 1'>Step 1</wizard-step>
      <wizard-step stepTitle='Steptitle 2' optionalStep>Step 2</wizard-step>
      <wizard-step stepTitle='Steptitle 3'>Step 3</wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  wizard: WizardComponent;
}

describe('WizardNavigationBarComponent', () => {
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
    const navigableLi = navBar.queryAll(By.css('li.navigable'));

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

    expect(navigableLi.length).toBe(0);
  });

  it('should show the second step correctly', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to second step
    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));
    const navigableLi = navBar.queryAll(By.css('li.navigable'));

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

    expect(navigableLi.length).toBe(1);
    expect(navigableLi[0]).toBe(allLi[0]);
  });

  it('should show the third step correctly', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to second step
    navigationMode.goToNextStep();
    // go to third step
    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));
    const navigableLi = navBar.queryAll(By.css('li.navigable'));

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

    expect(doneLi.length).toBe(2);
    expect(navigableLi[0]).toBe(allLi[0]);
    expect(navigableLi[1]).toBe(allLi[1]);
  });

  it('should show the third step correctly, after jump from first to third step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to third step and jump over the optional second step
    navigationMode.goToStep(2);
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));
    const navigableLi = navBar.queryAll(By.css('li.navigable'));

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

    expect(navigableLi.length).toBe(2);
    expect(navigableLi[0]).toBe(allLi[0]);
    expect(navigableLi[1]).toBe(allLi[1]);
  });

  it('should show the first step correctly, after going back from the second step to the first step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to second step
    navigationMode.goToNextStep();
    // go back to first step
    navigationMode.goToPreviousStep();
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));
    const navigableLi = navBar.queryAll(By.css('li.navigable'));

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

    expect(navigableLi.length).toBe(0);
  });

  it('should show the first step correctly, after first jumping from the first to the third step ' +
    'and then back from the third step to the first step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to third step, by jumping over the optional step
    navigationMode.goToStep(2);
    // go back to first step
    navigationMode.goToStep(0);
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));
    const navigableLi = navBar.queryAll(By.css('li.navigable'));

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

    expect(navigableLi.length).toBe(0);
  });

  it('should show the second step correctly, after first jumping from the first to the third step ' +
    'and then back from the third step to the second step', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    // go to third step, by jumping over the optional step
    navigationMode.goToStep(2);
    // go back to second step
    navigationMode.goToPreviousStep();
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));
    const navigableLi = navBar.queryAll(By.css('li.navigable'));

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

    expect(navigableLi.length).toBe(1);
    expect(navigableLi[0]).toBe(allLi[0]);
  });

  it('should disable navigation through the navigation bar correctly', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    wizardState.disableNavigationBar = true;
    // go to third step and jump over the optional second step
    navigationMode.goToStep(2);
    wizardTestFixture.detectChanges();

    const allLi = navBar.queryAll(By.css('li'));

    const currentLi = navBar.queryAll(By.css('li.current'));
    const doneLi = navBar.queryAll(By.css('li.done'));
    const editingLi = navBar.queryAll(By.css('li.editing'));
    const optionalLi = navBar.queryAll(By.css('li.optional'));
    const defaultLi = navBar.queryAll(By.css('li.default'));
    const navigableLi = navBar.queryAll(By.css('li.navigable'));

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

    expect(navigableLi.length).toBe(0);
  });

  it('should move back to the first step from the second step, after clicking on the corresponding link', () => {
    const goToFirstStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(1) a')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);

    // go to the second step
    navigationMode.goToNextStep();
    expect(wizardState.currentStepIndex).toBe(1);

    // go back to the first step
    goToFirstStepLink.click();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
  });

  it('should move back to the first step from the third step, after clicking on the corresponding link', () => {
    const goToFirstStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(1) a')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);

    // go to the second step
    navigationMode.goToStep(2);
    expect(wizardState.currentStepIndex).toBe(2);

    // go back to the first step
    goToFirstStepLink.click();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
  });

  it('should move back to the second step from the third step, after clicking on the corresponding link', () => {
    const goToSecondStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(2) a')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);

    // go to the second step
    navigationMode.goToStep(2);
    expect(wizardState.currentStepIndex).toBe(2);

    // go back to the first step
    goToSecondStepLink.click();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
  });

  it('should not move to the second step from the first step, after clicking on the corresponding link', () => {
    const goToFirstStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(1)'));
    const goToSecondStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(2)'));
    const goToThirdStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(3)'));

    expect(wizardState.currentStepIndex).toBe(0);
    // links contain a class that is not clickable (contains "pointer-events: none;")
    expect(goToFirstStepLink.classes.hasOwnProperty('current')).toBeTruthy('First step label is clickable');
    expect(goToSecondStepLink.classes.hasOwnProperty('default')).toBeTruthy('Second step label is clickable');
    expect(goToThirdStepLink.classes.hasOwnProperty('default')).toBeTruthy('Third step label is clickable');
  });

  it('should use the \"small\" layout when no navigation bar layout is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    expect(navBar.classes).toEqual({ 'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false });
  });

  it('should use the \"small\" layout when it is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = 'small';
    wizardTestFixture.detectChanges();

    expect(navBar.classes).toEqual({ 'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false });
  });

  it('should use the \"large-filled\" layout when it is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = 'large-filled';
    wizardTestFixture.detectChanges();

    expect(navBar.classes).toEqual({ 'horizontal': true, 'vertical': false, 'small': false,
      'large-filled': true, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false });
  });

  it('should use the \"large-empty\" layout when it is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = 'large-empty';
    wizardTestFixture.detectChanges();

    expect(navBar.classes).toEqual({ 'horizontal': true, 'vertical': false, 'small': false,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': true, 'large-empty-symbols': false });
  });

  it('should use the \"large-filled-symbols\" layout when it is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = 'large-filled-symbols';
    wizardTestFixture.detectChanges();

    expect(navBar.classes).toEqual({ 'horizontal': true, 'vertical': false, 'small': false,
      'large-filled': false, 'large-filled-symbols': true, 'large-empty': false, 'large-empty-symbols': false });
  });

  it('should use the \"large-empty-symbols\" layout when it is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = 'large-empty-symbols';
    wizardTestFixture.detectChanges();

    expect(navBar.classes).toEqual({ 'horizontal': true, 'vertical': false, 'small': false,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': true });
  });

  it('should show the correct step titles', () => {
    let navigationLinks = wizardTestFixture.debugElement.queryAll(By.css('wizard-navigation-bar ul li a'));

    expect(navigationLinks.length).toBe(3);
    expect(navigationLinks[0].nativeElement.innerText).toBe('STEPTITLE 1');
    expect(navigationLinks[1].nativeElement.innerText).toBe('STEPTITLE 2');
    expect(navigationLinks[2].nativeElement.innerText).toBe('STEPTITLE 3');
  });
});
