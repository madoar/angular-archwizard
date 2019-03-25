import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardComponent} from '../components/wizard.component';
import {WizardNavigationBarComponent} from '../components/wizard-navigation-bar.component';


@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1'>Step 1</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>Step 2</aw-wizard-step>
      <aw-wizard-completion-step stepTitle='Steptitle 3'>Step 3</aw-wizard-completion-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
}

@Component({
  selector: 'aw-test-wizard-with-back-links',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1'>Step 1</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>Step 2</aw-wizard-step>
      <aw-wizard-completion-step stepTitle='Steptitle 3' awEnableBackLinks>Step 3</aw-wizard-completion-step>
    </aw-wizard>
  `
})
class WizardTestWithBackLinksComponent {
}

describe('Navigation:', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent, WizardTestWithBackLinksComponent],
      imports: [ArchwizardModule]
    }).compileComponents();
  }));

  // https://github.com/madoar/angular-archwizard/issues/182
  it('isNavigable should be false after visiting completion step in strict mode', fakeAsync(() => {
    const wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();

    const debugElement = wizardTestFixture.debugElement;
    const wizardComponent = debugElement.query(By.css('aw-wizard')).injector.get(WizardComponent);
    const navBarComponent = debugElement.query(By.css('aw-wizard-navigation-bar')).injector.get(WizardNavigationBarComponent);
    const wizardState = wizardComponent.model;
    const navigationMode = wizardState.navigationMode;

    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(0))).toBeFalsy();
    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(1))).toBeFalsy();
    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(2))).toBeFalsy();

    navigationMode.goToNextStep();
    tick();
    navigationMode.goToNextStep();
    tick();
    expect(wizardState.currentStepIndex).toBe(2);

    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(0))).toBeFalsy();
    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(1))).toBeFalsy();
    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(2))).toBeFalsy();

    // goToPreviousStep should NOT succeed
    navigationMode.goToPreviousStep();
    tick();
    expect(wizardState.currentStepIndex).toBe(2);
  }));

  // https://github.com/madoar/angular-archwizard/issues/182
  it('isNavigable should be true after visiting completion step with back links enabled', fakeAsync(() => {
    const wizardTestFixture = TestBed.createComponent(WizardTestWithBackLinksComponent);
    wizardTestFixture.detectChanges();

    const debugElement = wizardTestFixture.debugElement;
    const wizardComponent = debugElement.query(By.css('aw-wizard')).injector.get(WizardComponent);
    const navBarComponent = debugElement.query(By.css('aw-wizard-navigation-bar')).injector.get(WizardNavigationBarComponent);

    const wizardState = wizardComponent.model;
    const navigationMode = wizardState.navigationMode;

    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(0))).toBeFalsy();
    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(1))).toBeFalsy();
    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(2))).toBeFalsy();

    navigationMode.goToNextStep();
    tick();
    navigationMode.goToNextStep();
    tick();

    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(0))).toBeTruthy();
    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(1))).toBeTruthy();
    expect(navBarComponent.isNavigable(wizardState.getStepAtIndex(2))).toBeFalsy();

    navigationMode.goToPreviousStep();
    tick();
    expect(wizardState.currentStepIndex).toBe(1);
  }));
});
