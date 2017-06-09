/**
 * Created by marc on 01.06.17.
 */
import {Directive, TemplateRef} from '@angular/core';

/**
 * The `wizardStepTitle` directive can be used as an alternative to the `title` input of a [[WizardStep]]
 * to define the content of a step title inside the navigation bar.
 * This title can be freely created and can contain more than only plain text
 *
 * ### Syntax
 *
 * ```html
 * <ng-template wizardStepTitle>
 *     ...
 * </ng-template>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: 'ng-template[wizardStepTitle]'
})
export class WizardStepTitleDirective {
  /**
   * Constructor
   *
   * @param templateRef A reference to the content of the `ng-template` that contains this [[WizardStepTitleDirective]]
   */
  constructor(public templateRef: TemplateRef<any>) { }
}
