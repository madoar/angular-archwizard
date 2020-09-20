import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ArchwizardModule } from '../archwizard.module';
import { WizardComponent } from '../components/wizard.component';
import { checkWizardState } from '../util/test-utils';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Not visible title'>
        <ng-template awStepTitle let-wizardStep="wizardStep">
        {{ wizardStep.completed ? 'D' : '' }}{{ wizardStep.editing ? 'E' : '' }}{{ wizardStep.selected ? 'S' : '' }} Steptitle 1
        </ng-template>
        Step 1
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Not visible title'>
        <ng-template awStepTitle>
          Steptitle 2
        </ng-template>
        Step 2
      </aw-wizard-step>
      <aw-wizard-completion-step stepTitle='Other not visible title'>
        <ng-template awWizardStepTitle>
          Steptitle 3
        </ng-template>
        Step 3
      </aw-wizard-completion-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('WizardStepTitleDirective', () => {
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardTest: WizardTestComponent;
  let wizard: WizardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [ArchwizardModule]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();

    wizardTest = wizardTestFixture.componentInstance;
    wizard = wizardTest.wizard;

    // wait a tick to ensure that the initialization has been completed
    tick();
    wizardTestFixture.detectChanges();
  }));

  it('should create an instance', () => {
    const navigationLinkEls = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li a'));

    checkWizardState(wizard, 0, false, [], false);

    expect(navigationLinkEls.length).toBe(3);
    expect(navigationLinkEls[0].nativeElement.textContent.trim()).toBe('S Steptitle 1');
    expect(navigationLinkEls[1].nativeElement.textContent.trim()).toBe('Steptitle 2');
    expect(navigationLinkEls[2].nativeElement.textContent.trim()).toBe('Steptitle 3');
  });

  it('should change first step title correctly upon completion state change', fakeAsync(() => {
    const navigationLinkEls = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li a'));

    // go to second step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, false, [0], false);

    // "S Steptitle 1" should become "D Steptitle 1"
    expect(navigationLinkEls.length).toBe(3);
    expect(navigationLinkEls[0].nativeElement.textContent.trim()).toBe('D Steptitle 1');
    expect(navigationLinkEls[1].nativeElement.textContent.trim()).toBe('Steptitle 2');
    expect(navigationLinkEls[2].nativeElement.textContent.trim()).toBe('Steptitle 3');
  }));

  it('should change first step title correctly upon editing state change', fakeAsync(() => {
    const navigationLinkEls = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li a'));

    // go to second step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    // go to first step
    wizard.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 0, true, [0], false);

    // "S Steptitle 1" should become "DES Steptitle 1"
    expect(navigationLinkEls.length).toBe(3);
    expect(navigationLinkEls[0].nativeElement.textContent.trim()).toBe('DES Steptitle 1');
    expect(navigationLinkEls[1].nativeElement.textContent.trim()).toBe('Steptitle 2');
    expect(navigationLinkEls[2].nativeElement.textContent.trim()).toBe('Steptitle 3');
  }));

  it('should change first step title correctly upon entering the completion step', fakeAsync(() => {
    const navigationLinkEls = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li a'));

    // go to second step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    // go to third step
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 2, false, [0, 1, 2], true);

    // "S Steptitle 1" should become "D Steptitle 1"
    expect(navigationLinkEls.length).toBe(3);
    expect(navigationLinkEls[0].nativeElement.textContent.trim()).toBe('D Steptitle 1');
    expect(navigationLinkEls[1].nativeElement.textContent.trim()).toBe('Steptitle 2');
    expect(navigationLinkEls[2].nativeElement.textContent.trim()).toBe('Steptitle 3');
  }));
});
