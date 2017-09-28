import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {WizardComponent} from './wizard.component';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step stepTitle='Steptitle 1'>Step 1</wizard-step>
      <wizard-step stepTitle='Steptitle 2'>Step 2</wizard-step>
      <wizard-step stepTitle='Steptitle 3'>Step 3</wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('WizardComponent', () => {
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

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTest.wizard).toBeTruthy();

    expect(wizardTestFixture.debugElement.query(By.css('wizard'))).toBeTruthy();
    expect(wizardTest.wizard.model).toBeTruthy();
    expect(wizardTest.wizard.navigation).toBeTruthy();

    expect(wizardTest.wizard.model).toBe(wizardState);
    expect(wizardTest.wizard.navigation).toBe(navigationMode);
  });

  it('should contain navigation bar at the correct position in default navBarLocation mode', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));
    const wizard = wizardTestFixture.debugElement.query(By.css('wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBar).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('wizard > :first-child')).name).toBe('wizard-navigation-bar');
    expect(wizardTestFixture.debugElement.query(By.css('wizard > :last-child')).name).toBe('div');

    expect(navBar.classes).toEqual({ 'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false });
    expect(wizard.classes).toEqual({ 'horizontal': true, 'vertical': false });
    expect(wizardStepsDiv.classes).toEqual({ 'wizard-steps': true, 'horizontal': true, 'vertical': false });
  });

  it('should contain navigation bar at the correct position in top navBarLocation mode', () => {
    wizardTest.wizard.navBarLocation = 'top';
    wizardTestFixture.detectChanges();

    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));
    const wizard = wizardTestFixture.debugElement.query(By.css('wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBar).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('wizard > :first-child')).name).toBe('wizard-navigation-bar');
    expect(wizardTestFixture.debugElement.query(By.css('wizard > :last-child')).name).toBe('div');

    expect(navBar.classes).toEqual({ 'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false });
    expect(wizard.classes).toEqual({ 'horizontal': true, 'vertical': false });
    expect(wizardStepsDiv.classes).toEqual({ 'wizard-steps': true, 'horizontal': true, 'vertical': false });
  });

  it('should contain navigation bar at the correct position in left navBarLocation mode', () => {
    wizardTest.wizard.navBarLocation = 'left';
    wizardTestFixture.detectChanges();

    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));
    const wizard = wizardTestFixture.debugElement.query(By.css('wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBar).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('wizard > :first-child')).name).toBe('wizard-navigation-bar');
    expect(wizardTestFixture.debugElement.query(By.css('wizard > :last-child')).name).toBe('div');

    expect(navBar.classes).toEqual({ 'horizontal': false, 'vertical': true, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false });
    expect(wizard.classes).toEqual({ 'horizontal': false, 'vertical': true });
    expect(wizardStepsDiv.classes).toEqual({ 'wizard-steps': true, 'horizontal': false, 'vertical': true });
  });

  it('should contain navigation bar at the correct position in bottom navBarLocation mode', () => {
    wizardTest.wizard.navBarLocation = 'bottom';
    wizardTestFixture.detectChanges();

    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));
    const wizard = wizardTestFixture.debugElement.query(By.css('wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBar).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('wizard > :first-child')).name).toBe('div');
    expect(wizardTestFixture.debugElement.query(By.css('wizard > :last-child')).name).toBe('wizard-navigation-bar');

    expect(navBar.classes).toEqual({ 'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false });
    expect(wizard.classes).toEqual({ 'horizontal': true, 'vertical': false });
    expect(wizardStepsDiv.classes).toEqual({ 'wizard-steps': true, 'horizontal': true, 'vertical': false });
  });

  it('should contain navigation bar at the correct position in right navBarLocation mode', () => {
    wizardTest.wizard.navBarLocation = 'right';
    wizardTestFixture.detectChanges();

    const navBar = wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'));
    const wizard = wizardTestFixture.debugElement.query(By.css('wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBar).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('wizard > :first-child')).name).toBe('div');
    expect(wizardTestFixture.debugElement.query(By.css('wizard > :last-child')).name).toBe('wizard-navigation-bar');

    expect(navBar.classes).toEqual({ 'horizontal': false, 'vertical': true, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false });
    expect(wizard.classes).toEqual({ 'horizontal': false, 'vertical': true });
    expect(wizardStepsDiv.classes).toEqual({ 'wizard-steps': true, 'horizontal': false, 'vertical': true });
  });
});
