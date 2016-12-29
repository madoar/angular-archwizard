import { Directive } from '@angular/core';

@Directive({
  selector: 'wizard-step[optionalStep]'
})
export class OptionalStepDirective {

  constructor() { }

}
