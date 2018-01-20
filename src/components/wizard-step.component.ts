import {Component, forwardRef} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';

/**
 * The `aw-wizard-step` component is used to define a normal step inside a wizard.
 *
 * ### Syntax
 *
 * With `stepTitle` input:
 *
 * ```html
 * <aw-wizard-step [stepTitle]="step title" [navigationSymbol]="symbol" [navigationSymbolFontFamily]="font-family"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    ...
 * </aw-wizard-step>
 * ```
 *
 * With `awWizardStepTitle` directive:
 *
 * ```html
 * <aw-wizard-step [navigationSymbol]="symbol" [navigationSymbolFontFamily]="font-family"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    <ng-template awWizardStepTitle>
 *        step title
 *    </ng-template>
 *    ...
 * </aw-wizard-step>
 * ```
 *
 * ### Example
 *
 * With `stepTitle` input:
 *
 * ```html
 * <aw-wizard-step stepTitle="Address information" navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    ...
 * </aw-wizard-step>
 * ```
 *
 * With `awWizardStepTitle` directive:
 *
 * ```html
 * <aw-wizard-step navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    <ng-template awWizardStepTitle>
 *        Address information
 *    </ng-template>
 * </aw-wizard-step>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'aw-wizard-step',
  templateUrl: 'wizard-step.component.html',
  styleUrls: ['wizard-step.component.css'],
  providers: [
    { provide: WizardStep, useExisting: forwardRef(() => WizardStepComponent) }
  ]
})
export class WizardStepComponent extends WizardStep {
}
