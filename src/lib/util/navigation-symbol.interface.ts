/**
 * A navigation symbol belonging to a wizard step.
 * A navigation symbol consists of the symbol itself and a font family
 *
 * @author Marc Arndt
 */
export interface NavigationSymbol {
  /**
   * The symbol to be used for a navigation step
   */
  symbol: string;

  /**
   * The font family to be used for this navigation symbol
   */
  fontFamily?: string;
}
