export function validBetSum(alias = 'gh') {
  return `sum(${alias}.bet_usd_amount)`;
}

export function validBetSumWithValid(alias = 'gh') {
  return `sum(
        CASE 
             WHEN NOT ${alias}.valid THEN 0 
             ELSE ${alias}.bet_point
        END)`;
}
