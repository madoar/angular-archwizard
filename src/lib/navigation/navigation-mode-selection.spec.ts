import {TestBed, async} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {ArchwizardModule} from '../archwizard.module';
import {WizardState} from './wizard-state.model';
import {WizardComponent} from '../components/wizard.component';
import {FreeNavigationMode} from './free-navigation-mode';
import {BaseNavigationMode} from './base-navigation-mode.interface';

class CustomNavigationMode extends BaseNavigationMode {
  public isNavigable(wizardState: WizardState, destinationIndex: number): boolean {
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
  selector: 'aw-wizard-with-free-nav-mode',
  template: `
    <aw-wizard [navigationMode]="navigationModeFactory">
      <aw-wizard-step stepTitle='Steptitle 1'>Step 1</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>Step 2</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3'>Step 3</aw-wizard-step>
    </aw-wizard>
  `
})
class WizardWithFreeNavigationModeComponent {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public navigationModeFactory() { return 'free'; }
}

@Component({
  selector: 'aw-wizard-with-custom-nav-mode',
  template: `
    <aw-wizard [navigationMode]="customNavigationMode">
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
      declarations: [WizardTestComponent, WizardWithFreeNavigationModeComponent, WizardWithCustomNavigationModeComponent],
      imports: [ArchwizardModule]
    }).compileComponents();
  }));

  it('can be created with an instance', () => {
    const wizardTestFixture = TestBed.createComponent(WizardWithCustomNavigationModeComponent);
    wizardTestFixture.detectChanges();
    const wizard = wizardTestFixture.componentInstance.wizard;

    expect(wizard.model.navigationMode).toEqual(jasmine.any(CustomNavigationMode));
  });

  it('can be assigned with updateNavigationMode', () => {
    const wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();
    const wizard = wizardTestFixture.componentInstance.wizard;

    const navigationMode = new CustomNavigationMode();
    wizard.updateNavigationMode(navigationMode);
    expect(wizard.model.navigationMode).toEqual(navigationMode);
  });

  it('can be assigned with updateNavigationMode by name', () => {
    const wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();
    const wizard = wizardTestFixture.componentInstance.wizard;

    wizard.updateNavigationMode('free');
    expect(wizard.model.navigationMode).toEqual(jasmine.any(FreeNavigationMode));
  });
});
