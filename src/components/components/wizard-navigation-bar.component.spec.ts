/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement, QueryList} from '@angular/core';

import {WizardNavigationBarComponent} from './wizard-navigation-bar.component';
import {WizardComponent} from "./wizard.component";
import {WizardStepComponent} from "./wizard-step.component";

describe('WizardNavigationBarComponent', () => {
  let component: WizardNavigationBarComponent;
  let fixture: ComponentFixture<WizardNavigationBarComponent>;

  beforeEach(async(() => {
    let wizard = new WizardComponent();

    wizard.wizardSteps = new QueryList<WizardStepComponent>();

    TestBed.configureTestingModule({
      declarations: [WizardNavigationBarComponent, WizardComponent, WizardStepComponent],
      providers: [{ provide: WizardComponent, useValue: wizard }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardNavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
