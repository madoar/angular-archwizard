import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';

/**
 * The `awPreviousStep` directive can be used to navigate to the previous step.
 * Compared to the [[NextStepDirective]] it's important to note, that this directive doesn't contain a `finalize` output method.
 *
 * ### Syntax
 *
 * ```html
 * <button awPreviousStep>...</button>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[awPreviousStep]'
})
export class PreviousStepDirective {
  /**
   * This [[EventEmitter]] is called directly before the current step is exited during a transition through a component with this directive.
   */
  @Output()
  public preFinalize: EventEmitter<void> = new EventEmitter();

  /**
   * This [[EventEmitter]] is called directly after the current step is exited during a transition through a component with this directive.
   */
  @Output()
  public postFinalize: EventEmitter<void> = new EventEmitter();

  /**
   * Constructor
   *
   * @param wizard The state of the wizard
   */
  constructor(private wizard: WizardComponent) {
  }

  /**
   * A convenience field for `preFinalize`
   */
  public get finalize(): EventEmitter<void> {
    return this.preFinalize;
  }

  /**
   * A convenience field for `preFinalize`
   *
   * @param emitter The [[EventEmitter]] to be set
   */
  @Output()
  public set finalize(emitter: EventEmitter<void>) {
    /* istanbul ignore next */
    this.preFinalize = emitter;
  }

  /**
   * Listener method for `click` events on the component with this directive.
   * After this method is called the wizard will try to transition to the previous step
   */
  @HostListener('click')
  public onClick(): void {
    this.wizard.goToPreviousStep(this.preFinalize, this.postFinalize);
  }
}
