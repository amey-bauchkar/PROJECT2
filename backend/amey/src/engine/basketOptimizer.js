/**
 * Basket Optimizer: Synchronizes NEP 2020 Minor & MDC Elective Baskets
 */

export const BASKET_SLOT_RESTRICTIONS = {
  // Minor Electives run synchronously in parallel rooms across weekdays
  BASKET_MINOR_1: [
    { day: 'Mon', period: 3 },
    { day: 'Tue', period: 3 },
    { day: 'Wed', period: 3 },
    { day: 'Thu', period: 3 },
    { day: 'Fri', period: 3 },
    { day: 'Tue', period: 4 },
    { day: 'Thu', period: 4 }
  ],
  // Multidisciplinary MDC Electives run synchronously across weekdays
  BASKET_MDC_1: [
    { day: 'Mon', period: 2 },
    { day: 'Tue', period: 2 },
    { day: 'Wed', period: 2 },
    { day: 'Thu', period: 2 },
    { day: 'Fri', period: 2 }
  ]
};

export function getBasketRestrictedSlots(basketId) {
  if (!basketId || !BASKET_SLOT_RESTRICTIONS[basketId]) {
    return null;
  }
  return BASKET_SLOT_RESTRICTIONS[basketId];
}
