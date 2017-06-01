/**
 * Created by marc on 01.06.17.
 */
import {Directive, TemplateRef} from '@angular/core';

/**
 * This directive is used to define the content of a step title inside the navigation bar.
 * This title can be freely created and can contain more than only plain text
 */
@Directive({
  selector: 'ng-template[wizardStepTitle]'
})
export class WizardStepTitleDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}
