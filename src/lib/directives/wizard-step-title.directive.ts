import {Directive, TemplateRef} from '@angular/core';

/**
 * The `awWizardStepTitle` directive can be used as an alternative to the `stepTitle` input of a [[WizardStep]]
 * to define the content of a step title inside the navigation bar.
 * This step title can be freely created and can contain more than only plain text
 *
 * ### Syntax
 *
 * ```html
 * <ng-template awWizardStepTitle>
 *     ...
 * </ng-template>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: 'ng-template[awStepTitle], ng-template[awWizardStepTitle]'
})
export class WizardStepTitleDirective {
  /**
   * Constructor
   *
   * @param templateRef A reference to the content of the `ng-template` that contains this [[WizardStepTitleDirective]]
   */
  constructor(public templateRef: TemplateRef<any>) {
  }
}
