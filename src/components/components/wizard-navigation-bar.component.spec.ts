/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {QueryList, ViewChild, Component, ContentChild, OnInit} from "@angular/core";
import {WizardNavigationBarComponent} from "./wizard-navigation-bar.component";
import {WizardComponent} from "./wizard.component";
import {WizardStepComponent} from "./wizard-step.component";
import {GoToStepDirective} from "../directives/go-to-step.directive";
import {By} from "@angular/platform-browser";

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step title='Steptitle 1'>Step 1</wizard-step>
      <wizard-step title='Steptitle 2'>Step 2</wizard-step>
      <wizard-step title='Steptitle 3'>Step 3</wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('WizardNavigationBarComponent', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardComponent, WizardStepComponent, WizardNavigationBarComponent, WizardTestComponent, GoToStepDirective ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;
    wizardTestFixture.detectChanges();
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'))).toBeTruthy();
  });
});
