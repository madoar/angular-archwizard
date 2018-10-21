import {NavigationMode} from './navigation-mode.interface';

/**
 * A [[NavigationMode]], which allows the user to navigate without any limitations,
 * as long as the current step can be exited in the given direction
 *
 * @author Marc Arndt
 */
export class FreeNavigationMode extends NavigationMode {

  public isNavigable(destinationIndex: number): boolean {
    return true;
  }
}
