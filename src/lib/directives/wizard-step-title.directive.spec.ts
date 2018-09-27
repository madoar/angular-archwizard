/**
 * Created by marc on 02.06.17.
 */
import {ViewChild, Component} from '@angular/core';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {WizardComponent} from '../components/wizard.component';
import {ArchwizardModule} from '../archwizard.module';


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
    let navigationLinks = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li a'));

    expect(navigationLinks.length).toBe(2);
    expect(navigationLinks[0].nativeElement.innerText).toBe('STEPTITLE 1');
    expect(navigationLinks[1].nativeElement.innerText).toBe('STEPTITLE 2');
  });
});
