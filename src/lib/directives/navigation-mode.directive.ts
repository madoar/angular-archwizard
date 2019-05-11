import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NavigationMode } from '../navigation/navigation-mode.interface';
import { ConfigurableNavigationMode } from '../navigation/configurable-navigation-mode';
import { WizardComponent } from '../components/wizard.component';


@Directive({
  selector: '[awNavigationMode]'
})
export class NavigationModeDirective implements OnChanges {

  @Input()
  public awNavigationMode: NavigationMode|null;

  @Input()
  public navigateBackward: 'allow'|'deny'|null;

  @Input()
  public navigateForward: 'allow'|'deny'|null;

  constructor(private wizard: WizardComponent) { }

  public ngOnChanges(changes: SimpleChanges): void {
    this.wizard.updateNavigationMode(this.getNavigationMode());
  }

  private getNavigationMode(): NavigationMode {
    if (this.awNavigationMode) {
      return this.awNavigationMode;
    }
    return new ConfigurableNavigationMode(this.navigateBackward, this.navigateForward);
  }

}

