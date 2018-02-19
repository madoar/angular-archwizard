import {Directive, forwardRef} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';

/**
 * The `awWizardStep` directive can be used to define a normal step inside a wizard.
 *
 * ### Syntax
 *
 * With `stepTitle` input:
 *
 * ```html
 * <div awWizardStep [stepTitle]="step title" [navigationSymbol]="{ symbol: 'symbol', fontFamily: 'font-family' }"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    ...
 * </div>
 * ```
 *
 * With `awWizardStepTitle` directive:
 *
 * ```html
 * <div awWizardStep [navigationSymbol]="{ symbol: 'symbol', fontFamily: 'font-family' }"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    <ng-template awWizardStepTitle>
 *        step title
 *    </ng-template>
 *    ...
 * </div>
 * ```
 *
 * ### Example
 *
 * With `stepTitle` input:
 *
 * ```html
 * <div awWizardStep stepTitle="Address information" [navigationSymbol]="{ symbol: '&#xf1ba;', fontFamily: 'FontAwesome' }">
 *    ...
 * </div>
 * ```
 *
 * With `awWizardStepTitle` directive:
 *
 * ```html
 * <div awWizardStep [navigationSymbol]="{ symbol: '&#xf1ba;', fontFamily: 'FontAwesome' }">
 *    <ng-template awWizardStepTitle>
 *        Address information
 *    </ng-template>
 * </div>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[awWizardStep]',
  providers: [
    { provide: WizardStep, useExisting: forwardRef(() => WizardStepDirective) }
  ]
})
export class WizardStepDirective extends WizardStep {
}
