import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ArchwizardModule } from '../archwizard.module';
import { WizardComponent } from './wizard.component';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1' [stepId]="firstStepId">
        Step 1
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2' awOptionalStep>
        Step 2
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3'>
        Step 3
      </aw-wizard-step>
      <aw-wizard-completion-step stepTitle='Steptitle 4'>
        Step 4
      </aw-wizard-completion-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  public firstStepId = 'step1';

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('WizardNavigationBarComponent', () => {
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardTest: WizardTestComponent;
  let wizard: WizardComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [ArchwizardModule]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();

    wizardTest = wizardTestFixture.componentInstance;
    wizard = wizardTest.wizard;
  }));

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'))).toBeTruthy();
  });

  it('should create only one navigation bar', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar')).length).toBe(1);
  });

  it('should show the initial step correctly', () => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTestFixture.detectChanges();

    const allLiELs = navBarEl.queryAll(By.css('li'));

    const currentLiEls = navBarEl.queryAll(By.css('li.current'));
    const doneLiEls = navBarEl.queryAll(By.css('li.done'));
    const completedLiEls = navBarEl.queryAll(By.css('li.completed'));
    const optionalLiEls = navBarEl.queryAll(By.css('li.optional'));
    const navigableLiEls = navBarEl.queryAll(By.css('li.navigable'));

    // the first step is the current step
    expect(currentLiEls.length).toBe(1);
    expect(currentLiEls[0]).toBe(allLiELs[0]);

    // no step is currently marked as done or completed
    expect(doneLiEls.length).toBe(0);
    expect(completedLiEls.length).toBe(0);

    // only the second step is marked as optional
    expect(optionalLiEls.length).toBe(1);
    expect(optionalLiEls[0]).toBe(allLiELs[1]);

    expect(navigableLiEls.length).toBe(0);
  });

  it('should show the second step correctly', fakeAsync(() => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // go to second step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    const allLiELs = navBarEl.queryAll(By.css('li'));

    const currentLiEls = navBarEl.queryAll(By.css('li.current'));
    const doneLiEls = navBarEl.queryAll(By.css('li.done'));
    const completedLiEls = navBarEl.queryAll(By.css('li.completed'));
    const optionalLiEls = navBarEl.queryAll(By.css('li.optional'));
    const navigableLiEls = navBarEl.queryAll(By.css('li.navigable'));

    // the second step is the current step
    expect(currentLiEls.length).toBe(1);
    expect(currentLiEls[0]).toBe(allLiELs[1]);

    // the first step should be marked as done
    expect(doneLiEls.length).toBe(1);
    expect(doneLiEls[0]).toBe(allLiELs[0]);

    // no step is marked as completed
    expect(completedLiEls.length).toBe(0);

    // the second step should still be marked as optional, even when it is selected
    expect(optionalLiEls.length).toBe(1);
    expect(optionalLiEls[0]).toBe(allLiELs[1]);

    expect(navigableLiEls.length).toBe(1);
    expect(navigableLiEls[0]).toBe(allLiELs[0]);
  }));

  it('should show the third step correctly', fakeAsync(() => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // go to second step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    // go to third step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    const allLiELs = navBarEl.queryAll(By.css('li'));

    const currentLiEls = navBarEl.queryAll(By.css('li.current'));
    const doneLiEls = navBarEl.queryAll(By.css('li.done'));
    const completedLiEls = navBarEl.queryAll(By.css('li.completed'));
    const optionalLiEls = navBarEl.queryAll(By.css('li.optional'));
    const navigableLiEls = navBarEl.queryAll(By.css('li.navigable'));

    // the third step is the current step
    expect(currentLiEls.length).toBe(1);
    expect(currentLiEls[0]).toBe(allLiELs[2]);

    // the first and second step should be marked as done
    expect(doneLiEls.length).toBe(2);
    expect(doneLiEls[0]).toBe(allLiELs[0]);
    expect(doneLiEls[1]).toBe(allLiELs[1]);

    // no step is marked as completed
    expect(completedLiEls.length).toBe(0);

    // the second step should still be marked as optional, even when it is also marked as "done"
    expect(optionalLiEls.length).toBe(1);
    expect(optionalLiEls[0]).toBe(allLiELs[1]);

    expect(navigableLiEls.length).toBe(2);
    expect(navigableLiEls[0]).toBe(allLiELs[0]);
    expect(navigableLiEls[1]).toBe(allLiELs[1]);
  }));

  it('should show the third step correctly, after jump from first to third step', fakeAsync(() => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // go to third step and jump over the optional second step
    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    const allLiELs = navBarEl.queryAll(By.css('li'));

    const currentLiEls = navBarEl.queryAll(By.css('li.current'));
    const doneLiEls = navBarEl.queryAll(By.css('li.done'));
    const completedLiEls = navBarEl.queryAll(By.css('li.completed'));
    const optionalLiEls = navBarEl.queryAll(By.css('li.optional'));
    const navigableLiEls = navBarEl.queryAll(By.css('li.navigable'));

    // the third step is the current step
    expect(currentLiEls.length).toBe(1);
    expect(currentLiEls[0]).toBe(allLiELs[2]);

    // the first step should be marked as done
    expect(doneLiEls.length).toBe(1);
    expect(doneLiEls[0]).toBe(allLiELs[0]);

    // no step is marked as completed
    expect(completedLiEls.length).toBe(0);

    // the second step is still marked as optional
    expect(optionalLiEls.length).toBe(1);
    expect(optionalLiEls[0]).toBe(allLiELs[1]);

    expect(navigableLiEls.length).toBe(2);
    expect(navigableLiEls[0]).toBe(allLiELs[0]);
    expect(navigableLiEls[1]).toBe(allLiELs[1]);
  }));

  it('should show the first step correctly, after going back from the second step to the first step', fakeAsync(() => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // go to second step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    // go back to first step
    wizard.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    const allLiELs = navBarEl.queryAll(By.css('li'));

    const currentLiEls = navBarEl.queryAll(By.css('li.current'));
    const doneLiEls = navBarEl.queryAll(By.css('li.done'));
    const completedLiEls = navBarEl.queryAll(By.css('li.completed'));
    const optionalLiEls = navBarEl.queryAll(By.css('li.optional'));
    const navigableLiEls = navBarEl.queryAll(By.css('li.navigable'));

    // the first step is the current step
    expect(currentLiEls.length).toBe(1);
    expect(currentLiEls[0]).toBe(allLiELs[0]);

    // the first step should still be marked as "done"
    expect(doneLiEls.length).toBe(1);
    expect(doneLiEls[0]).toBe(allLiELs[0]);

    // no step is marked as completed
    expect(completedLiEls.length).toBe(0);

    // the second step is marked as optional
    expect(optionalLiEls.length).toBe(1);
    expect(optionalLiEls[0]).toBe(allLiELs[1]);

    expect(navigableLiEls.length).toBe(0);
  }));

  it('should show the first step correctly, after first jumping from the first to the third step ' +
    'and then back from the third step to the first step', fakeAsync(() => {
      const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

      // go to third step, by jumping over the optional step
      wizard.goToStep(2);
      tick();
      wizardTestFixture.detectChanges();

      // go back to first step
      wizard.goToStep(0);
      tick();
      wizardTestFixture.detectChanges();

      const allLiELs = navBarEl.queryAll(By.css('li'));

      const currentLiEls = navBarEl.queryAll(By.css('li.current'));
      const doneLiEls = navBarEl.queryAll(By.css('li.done'));
      const completedLiEls = navBarEl.queryAll(By.css('li.completed'));
      const optionalLiEls = navBarEl.queryAll(By.css('li.optional'));
      const navigableLiEls = navBarEl.queryAll(By.css('li.navigable'));

      // the first step is the current step
      expect(currentLiEls.length).toBe(1);
      expect(currentLiEls[0]).toBe(allLiELs[0]);

      // the first step should still be marked as "done"
      expect(doneLiEls.length).toBe(1);
      expect(doneLiEls[0]).toBe(allLiELs[0]);

      // no step is marked as completed
      expect(completedLiEls.length).toBe(0);

      // the second step is marked as optional
      expect(optionalLiEls.length).toBe(1);
      expect(optionalLiEls[0]).toBe(allLiELs[1]);

      expect(navigableLiEls.length).toBe(0);
    }));

  it('should show the second step correctly, after first jumping from the first to the third step ' +
    'and then back from the third step to the second step', fakeAsync(() => {
      const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

      // go to third step, by jumping over the optional step
      wizard.goToStep(2);
      tick();
      wizardTestFixture.detectChanges();

      // go back to second step
      wizard.goToPreviousStep();
      tick();
      wizardTestFixture.detectChanges();

      const allLiELs = navBarEl.queryAll(By.css('li'));

      const currentLiEls = navBarEl.queryAll(By.css('li.current'));
      const doneLiEls = navBarEl.queryAll(By.css('li.done'));
      const completedLiEls = navBarEl.queryAll(By.css('li.completed'));
      const optionalLiEls = navBarEl.queryAll(By.css('li.optional'));
      const navigableLiEls = navBarEl.queryAll(By.css('li.navigable'));

      // the second step is the current step
      expect(currentLiEls.length).toBe(1);
      expect(currentLiEls[0]).toBe(allLiELs[1]);

      // the first step should be marked as done
      expect(doneLiEls.length).toBe(1);
      expect(doneLiEls[0]).toBe(allLiELs[0]);

      // no step is marked as completed
      expect(completedLiEls.length).toBe(0);

      // the second step should still be marked as optional, even when it is selected
      expect(optionalLiEls.length).toBe(1);
      expect(optionalLiEls[0]).toBe(allLiELs[1]);

      expect(navigableLiEls.length).toBe(1);
      expect(navigableLiEls[0]).toBe(allLiELs[0]);
    }));

  it('should mark completion steps completed after visiting the completion step', fakeAsync(() => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    // go to third step, by jumping over the optional step
    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    // go to the completion step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    const allLiEls = navBarEl.queryAll(By.css('li'));
    expect(allLiEls[0].classes['completed']).toBeFalsy('Only completion step should be marked completed');
    expect(allLiEls[1].classes['completed']).toBeFalsy('Only completion step should be marked completed');
    expect(allLiEls[2].classes['completed']).toBeFalsy('Only completion step should be marked completed');
    expect(allLiEls[3].classes['completed']).toBeTruthy('Completion step should be marked completed');
  }));

  it('should disable navigation through the navigation bar correctly', fakeAsync(() => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizard.disableNavigationBar = true;

    // go to third step and jump over the optional second step
    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    const allLiELs = navBarEl.queryAll(By.css('li'));

    const currentLiEls = navBarEl.queryAll(By.css('li.current'));
    const doneLiEls = navBarEl.queryAll(By.css('li.done'));
    const completedLiEls = navBarEl.queryAll(By.css('li.completed'));
    const optionalLiEls = navBarEl.queryAll(By.css('li.optional'));
    const navigableLiEls = navBarEl.queryAll(By.css('li.navigable'));

    // the third step is the current step
    expect(currentLiEls.length).toBe(1);
    expect(currentLiEls[0]).toBe(allLiELs[2]);

    // the first step should be marked as done
    expect(doneLiEls.length).toBe(1);
    expect(doneLiEls[0]).toBe(allLiELs[0]);

    // no step is marked as completed
    expect(completedLiEls.length).toBe(0);

    // the second step is marked as optional
    expect(optionalLiEls.length).toBe(1);
    expect(optionalLiEls[0]).toBe(allLiELs[1]);

    expect(navigableLiEls.length).toBe(0);
  }));

  it('should move back to the first step from the second step, after clicking on the corresponding link', fakeAsync(() => {
    const goToFirstStepLinkEl = wizardTestFixture.debugElement.query(By.css('li:nth-child(1) a')).nativeElement;

    expect(wizard.currentStepIndex).toBe(0);

    // go to the second step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);

    // go back to the first step
    goToFirstStepLinkEl.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(0);
  }));

  it('should move back to the first step from the third step, after clicking on the corresponding link', fakeAsync(() => {
    const goToFirstStepLinkEl = wizardTestFixture.debugElement.query(By.css('li:nth-child(1) a')).nativeElement;

    expect(wizard.currentStepIndex).toBe(0);

    // go to the second step
    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);

    // go back to the first step
    goToFirstStepLinkEl.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(0);
  }));

  it('should move back to the second step from the third step, after clicking on the corresponding link', fakeAsync(() => {
    const goToSecondStepLinkEl = wizardTestFixture.debugElement.query(By.css('li:nth-child(2) a')).nativeElement;

    expect(wizard.currentStepIndex).toBe(0);

    // go to the second step
    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);

    // go back to the first step
    goToSecondStepLinkEl.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
  }));

  it('should not move to the second step from the first step, after clicking on the corresponding link', () => {
    const goToFirstStepLinkEl = wizardTestFixture.debugElement.query(By.css('li:nth-child(1)'));
    const goToSecondStepLinkEl = wizardTestFixture.debugElement.query(By.css('li:nth-child(2)'));
    const goToThirdStepLinkEl = wizardTestFixture.debugElement.query(By.css('li:nth-child(3)'));

    expect(wizard.currentStepIndex).toBe(0);
    // links contain a class that is not clickable (contains "pointer-events: none;")
    expect(goToFirstStepLinkEl.classes['navigable']).toBeFalsy('First step label is clickable');
    expect(goToSecondStepLinkEl.classes['navigable']).toBeFalsy('Second step label is clickable');
    expect(goToThirdStepLinkEl.classes['navigable']).toBeFalsy('Third step label is clickable');
  });

  it('should use the \"small\" layout when no navigation bar layout is specified', () => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    expect(navBarEl.classes).toEqual({ 'horizontal': true, 'small': true });
  });

  it('should use the \"small\" layout when it is specified', () => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = 'small';
    wizardTestFixture.detectChanges();

    expect(navBarEl.classes).toEqual({ 'horizontal': true, 'small': true });
  });

  it('should use the \"large-filled\" layout when it is specified', () => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = 'large-filled';
    wizardTestFixture.detectChanges();

    expect(navBarEl.classes).toEqual({ 'horizontal': true, 'large-filled': true });
  });

  it('should use the \"large-empty\" layout when it is specified', () => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = 'large-empty';
    wizardTestFixture.detectChanges();

    expect(navBarEl.classes).toEqual({ 'horizontal': true, 'large-empty': true });
  });

  it('should use the \"large-filled-symbols\" layout when it is specified', () => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = 'large-filled-symbols';
    wizardTestFixture.detectChanges();

    expect(navBarEl.classes).toEqual({ 'horizontal': true, 'large-filled-symbols': true });
  });

  it('should use the \"large-empty-symbols\" layout when it is specified', () => {
    const navBarEl = wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'));

    wizardTest.wizard.navBarLayout = 'large-empty-symbols';
    wizardTestFixture.detectChanges();

    expect(navBarEl.classes).toEqual({ 'horizontal': true, 'large-empty-symbols': true });
  });

  it('should show the correct step titles', () => {
    const navigationLinkEls = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li a'));

    expect(navigationLinkEls.length).toBe(4);
    expect(navigationLinkEls[0].nativeElement.textContent.trim()).toBe('Steptitle 1');
    expect(navigationLinkEls[1].nativeElement.textContent.trim()).toBe('Steptitle 2');
    expect(navigationLinkEls[2].nativeElement.textContent.trim()).toBe('Steptitle 3');
    expect(navigationLinkEls[3].nativeElement.textContent.trim()).toBe('Steptitle 4');
  });

  it('should show the correct reversed step titles', () => {
    wizardTest.wizard.navBarDirection = 'right-to-left';
    wizardTestFixture.detectChanges();

    const navigationLinkEls = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li a'));

    expect(navigationLinkEls.length).toBe(4);
    expect(navigationLinkEls[0].nativeElement.textContent.trim()).toBe('Steptitle 4');
    expect(navigationLinkEls[1].nativeElement.textContent.trim()).toBe('Steptitle 3');
    expect(navigationLinkEls[2].nativeElement.textContent.trim()).toBe('Steptitle 2');
    expect(navigationLinkEls[3].nativeElement.textContent.trim()).toBe('Steptitle 1');
  });

  it('should have the correct stepId', () => {
    const navigationLiEls = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li'));

    expect(navigationLiEls.length).toBe(4);
    expect(navigationLiEls[0].nativeElement.id).toBe('step1');
    expect(navigationLiEls[1].nativeElement.id).toBe('');
    expect(navigationLiEls[2].nativeElement.id).toBe('');
    expect(navigationLiEls[3].nativeElement.id).toBe('');
  });

  it('should change the stepId correctly', () => {
    wizardTest.firstStepId = null;
    wizardTestFixture.detectChanges();

    const navigationLiEls = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li'));

    expect(navigationLiEls.length).toBe(4);
    expect(navigationLiEls[0].nativeElement.id).toBe('');
    expect(navigationLiEls[1].nativeElement.id).toBe('');
    expect(navigationLiEls[2].nativeElement.id).toBe('');
    expect(navigationLiEls[3].nativeElement.id).toBe('');
  });
});
