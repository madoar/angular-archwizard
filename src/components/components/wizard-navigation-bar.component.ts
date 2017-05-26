import {Component} from '@angular/core';
import {WizardComponent} from './wizard.component';
import {WizardStep} from '../util/WizardStep';

@Component({
  selector: 'wizard-navigation-bar',
  templateUrl: 'wizard-navigation-bar.component.html',
  styleUrls: ['wizard-navigation-bar.component.horizontal.less', 'wizard-navigation-bar.component.vertical.less']
})
export class WizardNavigationBarComponent {

  constructor(private wizard: WizardComponent) { }

  get wizardSteps(): Array<WizardStep> {
    return this.wizard.allSteps;
  }

  get numberOfWizardSteps(): number {
    return this.wizard.allSteps.length;
  }
}
