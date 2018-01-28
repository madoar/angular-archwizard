import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {WizardComponent} from './wizard.component';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {StrictNavigationMode} from '../navigation/strict-navigation-mode';
import {FreeNavigationMode} from '../navigation/free-navigation-mode';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard [navigationMode]="navigationMode" [disableNavigationBar]="disableNavigationBar" [defaultStepIndex]="defaultStepIndex">
      <aw-wizard-step stepTitle='Steptitle 1' *ngIf="showStep1">Step 1</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>Step 2</aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3' *ngIf="showStep3">Step 3</aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent implements AfterViewInit {
  public navigationMode = 'strict';

  public disableNavigationBar = false;

  public defaultStepIndex = 0;

  public showStep1 = true;
  public showStep3 = true;

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  constructor(private _changeDetectionRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    // Force another change detection in order to fix an occuring ExpressionChangedAfterItHasBeenCheckedError
    this._changeDetectionRef.detectChanges();
  }
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
    wizardState = wizardTestFixture.debugElement.query(By.css('aw-wizard')).injector.get(WizardState);
    navigationMode = wizardState.navigationMode;
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTest.wizard).toBeTruthy();

    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard'))).toBeTruthy();
    expect(wizardTest.wizard.model).toBeTruthy();
    expect(wizardTest.wizard.navigation).toBeTruthy();

    expect(wizardTest.wizard.model).toBe(wizardState);
    expect(wizardTest.wizard.navigation).toBe(navigationMode);
  });

  it('should contain navigation bar at the correct position in default navBarLocation mode', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));
    const wizard = wizardTestFixture.debugElement.query(By.css('aw-wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBar).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :first-child')).name).toBe('aw-wizard-navigation-bar');
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :last-child')).name).toBe('div');

    expect(navBar.classes).toEqual({
      'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false
    });
    expect(wizard.classes).toEqual({'horizontal': true, 'vertical': false});
    expect(wizardStepsDiv.classes).toEqual({'wizard-steps': true, 'horizontal': true, 'vertical': false});
  });

  it('should contain navigation bar at the correct position in top navBarLocation mode', () => {
    wizardTest.wizard.navBarLocation = 'top';
    wizardTestFixture.detectChanges();

    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));
    const wizard = wizardTestFixture.debugElement.query(By.css('aw-wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBar).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :first-child')).name).toBe('aw-wizard-navigation-bar');
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :last-child')).name).toBe('div');

    expect(navBar.classes).toEqual({
      'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false
    });
    expect(wizard.classes).toEqual({'horizontal': true, 'vertical': false});
    expect(wizardStepsDiv.classes).toEqual({'wizard-steps': true, 'horizontal': true, 'vertical': false});
  });

  it('should contain navigation bar at the correct position in left navBarLocation mode', () => {
    wizardTest.wizard.navBarLocation = 'left';
    wizardTestFixture.detectChanges();

    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));
    const wizard = wizardTestFixture.debugElement.query(By.css('aw-wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBar).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :first-child')).name).toBe('aw-wizard-navigation-bar');
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :last-child')).name).toBe('div');

    expect(navBar.classes).toEqual({
      'horizontal': false, 'vertical': true, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false
    });
    expect(wizard.classes).toEqual({'horizontal': false, 'vertical': true});
    expect(wizardStepsDiv.classes).toEqual({'wizard-steps': true, 'horizontal': false, 'vertical': true});
  });

  it('should contain navigation bar at the correct position in bottom navBarLocation mode', () => {
    wizardTest.wizard.navBarLocation = 'bottom';
    wizardTestFixture.detectChanges();

    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));
    const wizard = wizardTestFixture.debugElement.query(By.css('aw-wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBar).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :first-child')).name).toBe('div');
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :last-child')).name).toBe('aw-wizard-navigation-bar');

    expect(navBar.classes).toEqual({
      'horizontal': true, 'vertical': false, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false
    });
    expect(wizard.classes).toEqual({'horizontal': true, 'vertical': false});
    expect(wizardStepsDiv.classes).toEqual({'wizard-steps': true, 'horizontal': true, 'vertical': false});
  });

  it('should contain navigation bar at the correct position in right navBarLocation mode', () => {
    wizardTest.wizard.navBarLocation = 'right';
    wizardTestFixture.detectChanges();

    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));
    const wizard = wizardTestFixture.debugElement.query(By.css('aw-wizard'));
    const wizardStepsDiv = wizardTestFixture.debugElement.query(By.css('div.wizard-steps'));

    // check default: the navbar should be at the top of the wizard if no navBarLocation was set
    expect(navBar).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard')).children.length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :first-child')).name).toBe('div');
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard > :last-child')).name).toBe('aw-wizard-navigation-bar');

    expect(navBar.classes).toEqual({
      'horizontal': false, 'vertical': true, 'small': true,
      'large-filled': false, 'large-filled-symbols': false, 'large-empty': false, 'large-empty-symbols': false
    });
    expect(wizard.classes).toEqual({'horizontal': false, 'vertical': true});
    expect(wizardStepsDiv.classes).toEqual({'wizard-steps': true, 'horizontal': false, 'vertical': true});
  });

  it('should change the navigation mode correctly during runtime', () => {
    expect(wizardTest.wizard.navigation instanceof StrictNavigationMode).toBe(true);

    wizardTest.navigationMode = 'free';
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.navigation instanceof FreeNavigationMode).toBe(true);
  });

  it('should change disableNavigationBar correctly during runtime', () => {
    expect(wizardState.disableNavigationBar).toBe(false);

    wizardTest.disableNavigationBar = true;
    wizardTestFixture.detectChanges();

    expect(wizardState.disableNavigationBar).toBe(true);
  });

  it('should change defaultStepIndex correctly during runtime', () => {
    expect(wizardState.defaultStepIndex).toBe(0);

    wizardTest.defaultStepIndex = 1;
    wizardTestFixture.detectChanges();

    expect(wizardState.defaultStepIndex).toBe(1);
  });

  it('should react on a previous step removal and insertion correctly', fakeAsync(() => {
    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.wizardSteps.length).toBe(3);

    wizardTest.showStep1 = false;
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.wizardSteps.length).toBe(2);

    wizardTest.showStep1 = true;
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.wizardSteps.length).toBe(3);
  }));

  it('should react on a later step removal and insertion correctly', fakeAsync(() => {
    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.wizardSteps.length).toBe(3);

    wizardTest.showStep3 = false;
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.wizardSteps.length).toBe(2);

    wizardTest.showStep3 = true;
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.wizardSteps.length).toBe(3);
  }));

  it('should react on a combined removal and insertion of previous and later steps correctly', fakeAsync(() => {
    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.wizardSteps.length).toBe(3);

    wizardTest.showStep1 = false;
    wizardTest.showStep3 = false;
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.wizardSteps.length).toBe(1);

    wizardTest.showStep1 = true;
    wizardTest.showStep3 = true;
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.wizardSteps.length).toBe(3);
  }));
});
