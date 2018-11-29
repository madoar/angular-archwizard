import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {WizardNavigationBarComponent} from './wizard-navigation-bar.component';
import {WizardComponent} from './wizard.component';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {NavigationMode, WizardState} from '../navigation';
import {NavBarLayoutTypes} from '../util/nav-bar-layout-types.enum';
import {NavBarDirectionTypes} from '../util/nav-bar-direction-types.enum';
import {Observable} from 'rxjs';
import {WizardStep} from '../util';
import {first} from 'rxjs/operators';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='STEPTITLE 1'>Step 1</aw-wizard-step>
      <aw-wizard-step stepTitle='STEPTITLE 2' awOptionalStep>Step 2</aw-wizard-step>
      <aw-wizard-step stepTitle='STEPTITLE 3'>Step 3</aw-wizard-step>
    </aw-wizard>
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
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'))).toBeTruthy();
  });

  it('should create only one navigation bar', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar')).length).toBe(1);
  });

  it('should show the initial step correctly', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

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

  it('should show the second step correctly', fakeAsync(() => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // Step changed observable
    const stepChangedObs: Observable<WizardStep> = wizardState.stepChangedObs;

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 2');
    });

    // go to second step
    navigationMode.goToNextStep();
    tick();
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
  }));

  it('should show the third step correctly', fakeAsync(() => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // Step changed observable
    const stepChangedObs: Observable<WizardStep> = wizardState.stepChangedObs;

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 2');
    });

    // go to second step
    navigationMode.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    // go to third step
    navigationMode.goToNextStep();
    tick();
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
  }));

  it('should show the third step correctly, after jump from first to third step', fakeAsync(() => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // Step changed observable
    const stepChangedObs: Observable<WizardStep> = wizardState.stepChangedObs;

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 3');
    });

    // go to third step and jump over the optional second step
    navigationMode.goToStep(2);
    tick();
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
  }));

  it('should show the first step correctly, after going back from the second step to the first step', fakeAsync(() => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // Step changed observable
    const stepChangedObs: Observable<WizardStep> = wizardState.stepChangedObs;

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 2');
    });

    // go to second step
    navigationMode.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();


    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 1');
    });

    // go back to first step
    navigationMode.goToPreviousStep();
    tick();
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
  }));

  it('should show the first step correctly, after first jumping from the first to the third step ' +
     'and then back from the third step to the first step', fakeAsync(() => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // Step changed observable
    const stepChangedObs: Observable<WizardStep> = wizardState.stepChangedObs;

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 3');
    });

    // go to third step, by jumping over the optional step
    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 1');
    });

    // go back to first step
    navigationMode.goToStep(0);
    tick();
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
  }));

  it('should show the second step correctly, after first jumping from the first to the third step ' +
     'and then back from the third step to the second step', fakeAsync(() => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // Step changed observable
    const stepChangedObs: Observable<WizardStep> = wizardState.stepChangedObs;

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 3');
    });

    // go to third step, by jumping over the optional step
    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 2');
    });

    // go back to second step
    navigationMode.goToPreviousStep();
    tick();
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
  }));

  it('should disable navigation through the navigation bar correctly', fakeAsync(() => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardState.disableNavigationBar = true;

    // Step changed observable
    const stepChangedObs: Observable<WizardStep> = wizardState.stepChangedObs;

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 3');
    });

    // go to third step and jump over the optional second step
    navigationMode.goToStep(2);
    tick();
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
  }));

  it('should move back to the first step from the second step, after clicking on the corresponding link', fakeAsync(() => {
    const goToFirstStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(1) a')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);

    // Step changed observable
    const stepChangedObs: Observable<WizardStep> = wizardState.stepChangedObs;

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 2');
    });

    // go to the second step
    navigationMode.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 1');
    });

    // go back to the first step
    goToFirstStepLink.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
  }));

  it('should move back to the first step from the third step, after clicking on the corresponding link', fakeAsync(() => {
    const goToFirstStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(1) a')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);


    // Step changed observable
    const stepChangedObs: Observable<WizardStep> = wizardState.stepChangedObs;

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 3');
    });

    // go to the third step
    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 1');
    });

    // go back to the first step
    goToFirstStepLink.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
  }));

  it('should move back to the second step from the third step, after clicking on the corresponding link', fakeAsync(() => {
    const goToSecondStepLink = wizardTestFixture.debugElement.query(By.css('li:nth-child(2) a')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);

    // Step changed observable
    const stepChangedObs: Observable<WizardStep> = wizardState.stepChangedObs;

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 3');
    });

    // go to the third step
    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);

    stepChangedObs.pipe(first()).subscribe((currentStep: WizardStep) => {
      expect(currentStep.stepTitle).toEqual('STEPTITLE 2');
    });

    // go back to the second step
    goToSecondStepLink.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
  }));

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
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    expect(navBar.classes).toEqual({'small': true, horizontal: true});
  });

  it('should use the \"small\" layout when it is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = NavBarLayoutTypes.SMALL;
    wizardTestFixture.detectChanges();

    expect(navBar.classes).toEqual({'small': true, horizontal: true});
  });

  it('should use the \"large-filled\" layout when it is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = NavBarLayoutTypes.LARGE_FILLED;
    wizardTestFixture.detectChanges();

    expect(navBar.classes).toEqual({'horizontal': true, 'large-filled': true, small: false});
  });

  it('should use the \"large-empty\" layout when it is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = NavBarLayoutTypes.LARGE_EMPTY;
    wizardTestFixture.detectChanges();

    expect(navBar.classes).toEqual({'horizontal': true, 'large-empty': true, small: false});
  });

  it('should use the \"large-filled-symbols\" layout when it is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = NavBarLayoutTypes.LARGE_FILLED_SYMBOLS;
    wizardTestFixture.detectChanges();

    expect(navBar.classes).toEqual({'horizontal': true, 'large-filled-symbols': true, small: false});
  });

  it('should use the \"large-empty-symbols\" layout when it is specified', () => {
    const navBar = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = NavBarLayoutTypes.LARGE_EMPTY_SYMBOLS;
    wizardTestFixture.detectChanges();

    expect(navBar.classes).toEqual({'horizontal': true, 'large-empty-symbols': true, small: false});
  });

  it('should show the correct step titles', () => {
    const navigationLinks = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li a'));

    expect(navigationLinks.length).toBe(3);
    expect(navigationLinks[0].nativeElement.innerText).toBe('STEPTITLE 1');
    expect(navigationLinks[1].nativeElement.innerText).toBe('STEPTITLE 2');
    expect(navigationLinks[2].nativeElement.innerText).toBe('STEPTITLE 3');
  });

  it('should show the correct reversed step titles', () => {
    wizardTest.wizard.navBarDirection = NavBarDirectionTypes.RTL;
    wizardTestFixture.detectChanges();

    const navigationLinks = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li a'));

    expect(navigationLinks.length).toBe(3);
    expect(navigationLinks[0].nativeElement.innerText).toBe('STEPTITLE 3');
    expect(navigationLinks[1].nativeElement.innerText).toBe('STEPTITLE 2');
    expect(navigationLinks[2].nativeElement.innerText).toBe('STEPTITLE 1');
  });
});
