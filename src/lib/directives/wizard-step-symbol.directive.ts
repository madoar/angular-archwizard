import {Directive, TemplateRef} from '@angular/core';

/**
 * The `awWizardStepSymbol` directive can be used as an alternative to the `navigationSymbol` input of a [[WizardStep]]
 * to define the step symbol inside the navigation bar.  This way step symbol may contain arbitrary content.
 *
 * ### Syntax
 *
 * ```html
 * <ng-template awWizardStepSymbol>
 *     ...
 * </ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[awStepSymbol], ng-template[awWizardStepSymbol]'
})
export class WizardStepSymbolDirective {
  /**
   * Constructor
   *
   * @param templateRef A reference to the content of the `ng-template` that contains this [[WizardStepSymbolDirective]]
   */
  constructor(public templateRef: TemplateRef<any>) {
  }
}
