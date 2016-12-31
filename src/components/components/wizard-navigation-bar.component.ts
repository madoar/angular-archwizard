import {Component, QueryList} from "@angular/core";
import {WizardComponent} from "./wizard.component";
import {WizardStepComponent} from "./wizard-step.component";

@Component({
  selector: 'wizard-navigation-bar',
  templateUrl: 'wizard-navigation-bar.component.html',
  styleUrls: ['wizard-navigation-bar.component.less']
})
export class WizardNavigationBarComponent {

  constructor(private wizard: WizardComponent) { }

  getWizardSteps(): QueryList<WizardStepComponent> {
    return this.wizard.wizardSteps;
  }

  numberOfWizardSteps(): number {
    return this.wizard.wizardSteps.length;
  }

  goToStep(nextStep: WizardStepComponent): void {
    if (this.wizard.canGoToStep(nextStep)) {
      // If the next step is enterable, then enter it
      this.wizard.goToStep(nextStep);
    }
  }
}
