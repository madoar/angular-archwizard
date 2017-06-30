/**
 * Created by marc on 02.06.17.
 */
import {ViewChild, Component} from '@angular/core';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {WizardComponent} from '../components/wizard.component';
import {WizardModule} from '../wizard.module';


@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step title='Other not visible title'>
        <ng-template wizardStepTitle>
          Steptitle 1
        </ng-template>
        Step 1
      </wizard-step>
      <wizard-completion-step title='Other not visible title'>
        <ng-template wizardStepTitle>
          Steptitle 2
        </ng-template>
        Step 2
      </wizard-completion-step>
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('PreviousStepDirective', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [WizardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;
    wizardTestFixture.detectChanges();
  });

  it('should create an instance', () => {
    let navigationLinks = wizardTestFixture.debugElement.queryAll(By.css('wizard-navigation-bar ul li a'));

    expect(navigationLinks.length).toBe(2);
    expect(navigationLinks[0].nativeElement.innerText).toBe('STEPTITLE 1');
    expect(navigationLinks[1].nativeElement.innerText).toBe('STEPTITLE 2');
  });
});
