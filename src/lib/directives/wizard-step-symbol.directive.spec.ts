import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardComponent} from '../components/wizard.component';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Step A'>
        <ng-template awWizardStepSymbol>
          A
        </ng-template>
        Step A content
      </aw-wizard-step>
      <aw-wizard-completion-step stepTitle='Step B'>
        <ng-template awWizardStepSymbol>
          B
        </ng-template>
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
    const navigationSymbolEls = wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-navigation-bar ul li .step-indicator'));

    expect(navigationSymbolEls.length).toBe(2);
    expect(navigationSymbolEls[0].nativeElement.textContent.trim()).toBe('A');
    expect(navigationSymbolEls[1].nativeElement.textContent.trim()).toBe('B');
  });
});
