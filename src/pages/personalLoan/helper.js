export const homeReferencesArray = (t) => [
    {
        label: t('GLOBAL.HUSBAND_WIFE'),
        value: 'Husband/wife',
    },
    {
        label: t('GLOBAL.FATHER_MOTHER'),
        value: 'Father/Mother',
    },
    {
        label: t('GLOBAL.BROTHER'),
        value: 'Brother',
    },
    {
        label: t('GLOBAL.FRIEND'),
        value: 'Friend',
    },
];

export const localReferencesArray = (t) => [
    {
        label: t('GLOBAL.RELATIVE'),
        value: 'Relative',
    },
    {
        label: t('GLOBAL.ROOM_MATE'),
        value: 'Room Mate',
    },
    {
        label: t('GLOBAL.FRIEND'),
        value: 'Friend',
    },
    {
        label: t('GLOBAL.CO_WORKER'),
        value: 'Co-Worker',
    },
    {
        label: t('GLOBAL.HUSBAND_WIFE'),
        value: 'Husband/wife',
    },
];

export function foundBracket(brackets = [], eligibleAmount = 0, noInstallment = 0) {
    const filtered = brackets.filter(item =>
            Number(item.NoOfInstallment) === Number(noInstallment) &&
            Number(item.FromAmount) <= Number(eligibleAmount)
    ).sort((a, b) => a.FromAmount - b.FromAmount);

    // Find the bracket with highest ToAmount among filtered ones
    const maxToAmountBracket = filtered.reduce((max, item) =>
            !max || item.ToAmount > max.ToAmount ? item : max,
        null
    );
    return maxToAmountBracket;
}

export function filterBracket(brackets = [], eligibleAmount = 0, noInstallment = 0) {
    const filtered = brackets.filter(item =>
            Number(item.NoOfInstallment) === Number(noInstallment) &&
            Number(item.FromAmount) <= Number(eligibleAmount)
    ).sort((a, b) => a.FromAmount - b.FromAmount);

    // Find the bracket with highest ToAmount among filtered ones
    const maxToAmountBracket = filtered.reduce((max, item) =>
            !max || item.ToAmount > max.ToAmount ? item : max,
        null
    );

    const maxMonthlyProcessingFee = Number(maxToAmountBracket?.MonthlyProcessingFee || 0) ?? null;

    return {
        filteredBrackets: filtered,
        maxMonthlyProcessingFee
    };
}

export function renderInstallmentCount(noOfInstallment, t) {
    return noOfInstallment ? `${noOfInstallment} Month${noOfInstallment > 1 ? 's' : ''}` : '';
};
