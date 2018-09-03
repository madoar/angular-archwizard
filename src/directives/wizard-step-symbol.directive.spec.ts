import {ViewChild, Component} from '@angular/core';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {WizardComponent} from '../components/wizard.component';
import {ArchwizardModule} from '../archwizard.module';


@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Step A'>
        <ng-template awWizardStepSymbol>A</ng-template>
        Step A content
      </aw-wizard-step>
      <aw-wizard-completion-step stepTitle='Step B'>
        <ng-template awWizardStepSymbol>B</ng-template>
        Step B content
      </aw-wizard-completion-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('WizardStepSymbolDirective', () => {
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
    let navigationSymbols = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li .step-indicator'));

    expect(navigationSymbols.length).toBe(2);
    expect(navigationSymbols[0].nativeElement.innerText).toBe('A');
    expect(navigationSymbols[1].nativeElement.innerText).toBe('B');
  });
});
