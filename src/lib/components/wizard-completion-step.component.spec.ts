import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ArchwizardModule } from '../archwizard.module';
import { MovingDirection } from '../util/moving-direction.enum';
import { WizardComponent } from './wizard.component';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">
        Step 1
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2' [canExit]="isValid" awOptionalStep (stepEnter)="enterInto($event, 2)"
                      (stepExit)="exitFrom($event, 2)">
        Step 2
      </aw-wizard-step>
      <aw-wizard-completion-step stepTitle='Completion steptitle 3' (stepEnter)="enterInto($event, 3)">
        Step 3
      </aw-wizard-completion-step>
    </aw-wizard>
  `
})
class WizardTestComponent {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public isValid: any = true;

  public eventLog: Array<string> = [];

  public enterInto(direction: MovingDirection, destination: number): void {
    this.eventLog.push(`enter ${MovingDirection[direction]} ${destination}`);
  }

  public exitFrom(direction: MovingDirection, source: number): void {
    this.eventLog.push(`exit ${MovingDirection[direction]} ${source}`);
  }
}

describe('WizardCompletionStepComponent', () => {
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

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-step')).length).toBe(2);
    expect(wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-completion-step')).length).toBe(1);
  });
});
