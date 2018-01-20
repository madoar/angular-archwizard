import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';

/**
 * The `nextStep` directive can be used to navigate to the next step.
 *
 * ### Syntax
 *
 * ```html
 * <button nextStep (finalize)="finalize method">...</button>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[nextStep]'
})
export class NextStepDirective {
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
   * A convenience name for `preFinalize`
   *
   * @param emitter The [[EventEmitter]] to be set
   */
  @Output()
  public set finalize(emitter: EventEmitter<void>) {
    /* istanbul ignore next */
    this.preFinalize = emitter;
  }

  /**
   * A convenience field for `preFinalize`
   */
  public get finalize(): EventEmitter<void> {
    return this.preFinalize;
  }

  /**
   * The navigation mode
   */
  private get navigationMode(): NavigationMode {
    return this.wizardState.navigationMode;
  }

  /**
   * Constructor
   *
   * @param wizardState The state of the wizard
   */
  constructor(private wizardState: WizardState) { }

  /**
   * Listener method for `click` events on the component with this directive.
   * After this method is called the wizard will try to transition to the next step
   */
  @HostListener('click', ['$event']) onClick(): void {
    this.navigationMode.goToNextStep(this.preFinalize, this.postFinalize);
  }
}
