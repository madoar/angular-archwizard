import {TestBed, async} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {ArchwizardModule} from '../archwizard.module';
import {WizardComponent} from '../components/wizard.component';
import {BaseNavigationMode} from './base-navigation-mode.interface';

class CustomNavigationMode extends BaseNavigationMode {
  public isNavigable(wizard: WizardComponent, destinationIndex: number): boolean {
    return true;
  }
}

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1'>Step 1</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>Step 2</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3'>Step 3</aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

@Component({
  selector: 'aw-wizard-with-custom-nav-mode',
  template: `
    <aw-wizard [awNavigationMode]="customNavigationMode">
      <aw-wizard-step stepTitle='Steptitle 1'>Step 1</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>Step 2</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3'>Step 3</aw-wizard-step>
    </aw-wizard>
  `
})
class WizardWithCustomNavigationModeComponent {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public customNavigationMode: CustomNavigationMode = new CustomNavigationMode();
}

describe('NavigationMode', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent, WizardWithCustomNavigationModeComponent],
      imports: [ArchwizardModule]
    }).compileComponents();
  }));

  it('can be created with an instance', () => {
    const wizardTestFixture = TestBed.createComponent(WizardWithCustomNavigationModeComponent);
    wizardTestFixture.detectChanges();
    const wizard = wizardTestFixture.componentInstance.wizard;

    expect(wizard.navigation).toEqual(jasmine.any(CustomNavigationMode));
  });

  it('can be assigned with .navigation setter', () => {
    const wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();
    const wizard = wizardTestFixture.componentInstance.wizard;

    const navigationMode = new CustomNavigationMode();
    wizard.navigation = navigationMode;
    expect(wizard.navigation).toEqual(navigationMode);
  });
});
