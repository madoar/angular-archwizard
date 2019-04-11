import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardComponent} from '../components/wizard.component';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Not visible title'>
        <ng-template awStepTitle>
          Steptitle 1
        </ng-template>
        Step 1
      </aw-wizard-step>
      <aw-wizard-completion-step stepTitle='Other not visible title'>
        <ng-template awWizardStepTitle>
          Steptitle 2
        </ng-template>
        Step 2
      </aw-wizard-completion-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('WizardStepTitleDirective', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

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
  });

  it('should create an instance', () => {
    const navigationLinkEls = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li a'));

    expect(navigationLinkEls.length).toBe(2);
    expect(navigationLinkEls[0].nativeElement.innerText).toBe('STEPTITLE 1');
    expect(navigationLinkEls[1].nativeElement.innerText).toBe('STEPTITLE 2');
  });
});
