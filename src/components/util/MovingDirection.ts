/**
 * The direction in which a step transition was made
 *
 * @author Marc Arndt
 */
export enum MovingDirection {
  /**
   * A forward step transition
   */
  Forwards,
  /**
   * A backward step transition
   */
  Backwards,
  /**
   * No step transition was done
   */
  Stay
}
